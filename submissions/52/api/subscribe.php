<?php
/**
 * NovaPulse Newsletter Subscription API
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?: $_POST;

$email = isset($data['email']) ? trim(filter_var($data['email'], FILTER_SANITIZE_EMAIL)) : '';

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

$storageFile = __DIR__ . '/../data/subscribers.json';
$subscribers = [];

if (file_exists($storageFile)) {
    $subscribers = json_decode(file_get_contents($storageFile), true) ?: [];
}

// Check if already subscribed
foreach ($subscribers as $sub) {
    if (strtolower($sub['email']) === strtolower($email)) {
        echo json_encode(['success' => true, 'message' => 'You are already subscribed to NovaPulse updates!']);
        exit;
    }
}

$subscribers[] = [
    'email'     => $email,
    'timestamp' => date('Y-m-d H:i:s')
];

file_put_contents($storageFile, json_encode($subscribers, JSON_PRETTY_PRINT));

echo json_encode([
    'success' => true,
    'message' => 'Welcome to the NovaPulse inner circle! Check your inbox for exclusive updates.'
]);
