<?php
/**
 * NovaPulse Community Feedback & Review API
 * Handles GET (fetch reviews) and POST (submit new review).
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

$storageFile = __DIR__ . '/../data/feedback.json';

// Fetch feedback list
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($storageFile)) {
        $feedback = json_decode(file_get_contents($storageFile), true) ?: [];
    } else {
        $feedback = [];
    }
    echo json_encode(['success' => true, 'data' => $feedback]);
    exit;
}

// Add new feedback
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;

    $name    = isset($data['name']) ? trim(htmlspecialchars($data['name'])) : '';
    $role    = isset($data['role']) ? trim(htmlspecialchars($data['role'])) : 'Tech Innovator';
    $message = isset($data['message']) ? trim(htmlspecialchars($data['message'])) : '';
    $rating  = isset($data['rating']) ? (int)$data['rating'] : 5;

    if (empty($name) || empty($message)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Name and feedback message are required fields.']);
        exit;
    }

    $existing = file_exists($storageFile) ? json_decode(file_get_contents($storageFile), true) ?: [] : [];

    // Generate Avatar Initials
    $nameParts = explode(' ', $name);
    $initials = strtoupper(substr($nameParts[0], 0, 1) . (isset($nameParts[1]) ? substr($nameParts[1], 0, 1) : ''));

    $newReview = [
        'id'      => 'fb-' . time(),
        'name'    => $name,
        'role'    => $role,
        'rating'  => max(1, min(5, $rating)),
        'avatar'  => $initials ?: 'NP',
        'message' => $message,
        'date'    => date('Y-m-d')
    ];

    array_unshift($existing, $newReview);
    file_put_contents($storageFile, json_encode($existing, JSON_PRETTY_PRINT));

    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your feedback! Your review has been added to our wall.',
        'data'    => $newReview
    ]);
    exit;
}
