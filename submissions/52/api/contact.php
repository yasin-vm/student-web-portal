<?php
/**
 * NovaPulse Contact Form API Endpoint
 * Handles contact submissions, validation, honeypot anti-spam check, and JSON storage.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed. Please use POST.'
    ]);
    exit;
}

// Get JSON input or raw POST
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    $data = $_POST;
}

// Anti-Spam Honeypot Check
if (!empty($data['website_hp'])) {
    // Bot detected: return fake success to trick bot
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your request has been logged successfully.'
    ]);
    exit;
}

// Extract and sanitize fields
$name    = isset($data['name']) ? trim(htmlspecialchars($data['name'])) : '';
$email   = isset($data['email']) ? trim(filter_var($data['email'], FILTER_SANITIZE_EMAIL)) : '';
$subject = isset($data['subject']) ? trim(htmlspecialchars($data['subject'])) : '';
$message = isset($data['message']) ? trim(htmlspecialchars($data['message'])) : '';

// Validation
$errors = [];
if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Please enter your full name (minimum 2 characters).';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Please enter a detailed message (minimum 10 characters).';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $errors)
    ]);
    exit;
}

// Save to JSON Database
$storageFile = __DIR__ . '/../data/submissions.json';
$existingSubmissions = [];

if (file_exists($storageFile)) {
    $fileContent = file_get_contents($storageFile);
    $existingSubmissions = json_decode($fileContent, true) ?: [];
}

$newSubmission = [
    'id'        => 'sub_' . time() . '_' . rand(100, 999),
    'name'      => $name,
    'email'     => $email,
    'subject'   => $subject ?: 'General Inquiry',
    'message'   => $message,
    'timestamp' => date('Y-m-d H:i:s'),
    'ip'        => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'
];

array_unshift($existingSubmissions, $newSubmission);
file_put_contents($storageFile, json_encode($existingSubmissions, JSON_PRETTY_PRINT));

// Send Success Response
echo json_encode([
    'success' => true,
    'message' => 'Thank you ' . $name . '! Your consultation request has been submitted successfully. Our engineering team will contact you shortly.'
]);
