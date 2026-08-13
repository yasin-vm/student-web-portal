<?php
/**
 * NovaPulse Portfolio Projects REST API
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$storageFile = __DIR__ . '/../data/projects.json';

if (!file_exists($storageFile)) {
    echo json_encode(['success' => false, 'data' => []]);
    exit;
}

$projects = json_decode(file_get_contents($storageFile), true) ?: [];
$category = isset($_GET['category']) ? strtolower(trim($_GET['category'])) : 'all';

if ($category !== 'all') {
    $projects = array_values(array_filter($projects, function ($proj) use ($category) {
        return strtolower($proj['category']) === $category;
    }));
}

echo json_encode(['success' => true, 'count' => count($projects), 'data' => $projects]);
