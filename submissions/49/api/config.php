<?php
// Cyber Strike: Neon Vanguard - Database & PHP Config Configuration

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dataDir = __DIR__ . '/../data';
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0777, true);
}

$dbPath = $dataDir . '/game.sqlite';
$scoresJsonPath = $dataDir . '/scores.json';
$saveJsonPath = $dataDir . '/save.json';
$statsJsonPath = $dataDir . '/stats.json';

// Initialize PDO SQLite if available, else JSON fallback
$pdo = null;
if (class_exists('PDO') && in_array('sqlite', PDO::getAvailableDrivers())) {
    try {
        $pdo = new PDO("sqlite:" . $dbPath);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Create high scores table
        $pdo->exec("CREATE TABLE IF NOT EXISTS high_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT NOT NULL,
            score INTEGER NOT NULL,
            wave INTEGER NOT NULL,
            ship_type TEXT NOT NULL,
            kills INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");

        // Create player save table
        $pdo->exec("CREATE TABLE IF NOT EXISTS player_save (
            player_id TEXT PRIMARY KEY,
            credits INTEGER DEFAULT 0,
            unlocked_ships TEXT NOT NULL,
            upgrades TEXT NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");

        // Create stats counter table
        $pdo->exec("CREATE TABLE IF NOT EXISTS global_stats (
            key TEXT PRIMARY KEY,
            value INTEGER DEFAULT 0
        )");
    } catch (Exception $e) {
        $pdo = null; // Fallback to JSON if SQLite error occurs
    }
}

// Helper: Read JSON file safely
function readJsonFile($filePath, $default = []) {
    if (!file_exists($filePath)) {
        file_put_contents($filePath, json_encode($default, JSON_PRETTY_PRINT));
        return $default;
    }
    $content = file_get_contents($filePath);
    $data = json_decode($content, true);
    return is_array($data) ? $data : $default;
}

// Helper: Write JSON file safely
function writeJsonFile($filePath, $data) {
    file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT), LOCK_EX);
}
