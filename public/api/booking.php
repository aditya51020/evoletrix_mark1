<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.inc.php';
require __DIR__ . '/mailer.inc.php';

require_method('POST');

// Must match BookingModal.jsx's `timeSlots` array exactly. Defined once,
// here, and used both to whitelist-check the submitted slot and to build
// the exact date+time instant when checking "is this slot already past".
const EVX_BOOKING_TIME_SLOTS = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
];

const EVX_BOOKING_MAX_DAYS_AHEAD = 90;

$input = json_input();

// Honeypot: real users never fill this (hidden via CSS, not type="hidden",
// so autofill can't touch it either). Bots often fill every field blindly.
// Reject silently with a fake success so scrapers don't learn anything.
if (trim((string) ($input['hp_field_x'] ?? '')) !== '') {
    json_response(['success' => true, 'message' => "Request received! We'll confirm your slot by email within 24 hours."]);
}

if (!check_rate_limit('booking:' . evx_client_ip(), 5, 600)) {
    json_error('Too many submissions. Please try again in a few minutes.', 429);
}

$name = trim((string) ($input['name'] ?? ''));
$email = trim((string) ($input['email'] ?? ''));
$dateRaw = trim((string) ($input['date'] ?? ''));
$timeRaw = trim((string) ($input['time'] ?? ''));
$message = trim((string) ($input['message'] ?? ''));

if ($name === '' || mb_strlen($name) > 190) {
    json_error('A valid name is required.', 422);
}
if ($email === '' || mb_strlen($email) > 190 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_error('A valid email address is required.', 422);
}
if (mb_strlen($message) > 3000) {
    json_error('Message is too long.', 422);
}

$tz = new DateTimeZone('Asia/Kolkata');

// Strict Y-m-d parse with an exact round-trip check: createFromFormat()
// silently "rolls over" invalid dates like 2026-02-30 into a valid one
// instead of failing, so comparing the reformatted string back against
// the input is what actually catches that. The leading "!" resets every
// field DateTime doesn't get from the format to the Unix epoch (00:00:00)
// instead of inheriting the current time, giving a clean midnight value.
$dateObj = DateTime::createFromFormat('!Y-m-d', $dateRaw, $tz);
if ($dateObj === false || $dateObj->format('Y-m-d') !== $dateRaw) {
    json_error('A valid date is required.', 422);
}

if (!in_array($timeRaw, EVX_BOOKING_TIME_SLOTS, true)) {
    json_error('A valid time slot is required.', 422);
}

$today = new DateTime('today', $tz);
$maxDate = (clone $today)->modify('+' . EVX_BOOKING_MAX_DAYS_AHEAD . ' days');

if ($dateObj < $today) {
    json_error('This date has already passed.', 422);
}
if ($dateObj > $maxDate) {
    json_error('Bookings are only available up to ' . EVX_BOOKING_MAX_DAYS_AHEAD . ' days in advance.', 422);
}

// Same-day booking: also reject a slot whose start time has already
// passed. h:i A matches the whitelist's exact "10:00 AM" / "02:00 PM" shape.
if ($dateObj->format('Y-m-d') === $today->format('Y-m-d')) {
    $now = new DateTime('now', $tz);
    $slotInstant = DateTime::createFromFormat('!Y-m-d h:i A', $dateRaw . ' ' . $timeRaw, $tz);
    if ($slotInstant === false || $slotInstant <= $now) {
        json_error('That time slot has already passed today. Please choose a later slot.', 422);
    }
}

$pdo = evx_db();
$stmt = $pdo->prepare(
    "INSERT INTO contact_submissions (type, name, email, message, booking_date, booking_time, created_at)
     VALUES ('booking', :name, :email, :message, :booking_date, :booking_time, NOW())"
);
try {
    $stmt->execute([
        'name' => $name,
        'email' => $email,
        'message' => $message !== '' ? $message : null,
        'booking_date' => $dateRaw,
        'booking_time' => $timeRaw,
    ]);
} catch (PDOException $e) {
    // 1062 = MySQL duplicate-entry, from uniq_booking_slot — someone else
    // already took this exact date+time between page load and submit.
    if ((int) $e->errorInfo[1] === 1062) {
        json_error('This time slot is no longer available. Please choose another time.', 409);
    }
    throw $e;
}

$body = '<h2>New consultation booking request</h2>'
    . '<p><strong>Name:</strong> ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '</p>'
    . '<p><strong>Email:</strong> ' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '</p>'
    . '<p><strong>Date:</strong> ' . htmlspecialchars($dateObj->format('l, F j, Y'), ENT_QUOTES, 'UTF-8') . '</p>'
    . '<p><strong>Time:</strong> ' . htmlspecialchars($timeRaw, ENT_QUOTES, 'UTF-8') . '</p>';
if ($message !== '') {
    $body .= '<p><strong>Message:</strong><br>' . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . '</p>';
}

// Submission is already saved above; a failed notification email must
// never turn into a failed request for the person who just booked. Note:
// this notifies the ADMIN mailbox only — no auto-reply is sent to the
// submitter's address, since that would let anyone use our SMTP relay to
// email arbitrary third parties by putting their address in the form.
$sent = evx_send_mail('New booking request: ' . $name . ' — ' . $dateRaw . ' ' . $timeRaw, $body, $email, $name);
if (!$sent) {
    error_log('Evoletrix: booking notification email failed for ' . $email);
}

json_response(['success' => true, 'message' => "Request received! We'll confirm your slot by email within 24 hours."]);
