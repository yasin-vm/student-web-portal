<?php
// Cyber Strike: Neon Vanguard - Global Server Stats API

require_once __DIR__ . '/config.php';

$stats = readJsonFile($statsJsonPath, [
    "total_games" => 124,
    "total_kills" => 3840,
    "highest_score" => 125000
]);

echo json_encode([
    "status" => "success",
    "server_time" => date("Y-m-d H:i:s T"),
    "php_version" => PHP_VERSION,
    "stats" => $stats
]);
exit();
