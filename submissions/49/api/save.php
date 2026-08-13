<?php
// Cyber Strike: Neon Vanguard - Save & Shop Upgrades API

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $playerId = isset($_GET['player_id']) ? strip_tags($_GET['player_id']) : 'default_pilot';
    
    $defaultSave = [
        "player_id" => $playerId,
        "credits" => 250,
        "unlocked_ships" => ["Vanguard"],
        "upgrades" => [
            "max_health" => 0,
            "fire_rate" => 0,
            "move_speed" => 0,
            "magnet_radius" => 0
        ]
    ];

    $allSaves = readJsonFile($saveJsonPath, []);
    $saveData = isset($allSaves[$playerId]) ? $allSaves[$playerId] : $defaultSave;

    echo json_encode(["status" => "success", "save" => $saveData]);
    exit();
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid JSON payload"]);
        exit();
    }

    $playerId = !empty($input['player_id']) ? strip_tags($input['player_id']) : 'default_pilot';
    $credits = isset($input['credits']) ? max(0, intval($input['credits'])) : 0;
    $unlockedShips = isset($input['unlocked_ships']) && is_array($input['unlocked_ships']) ? $input['unlocked_ships'] : ["Vanguard"];
    $upgrades = isset($input['upgrades']) && is_array($input['upgrades']) ? $input['upgrades'] : [
        "max_health" => 0,
        "fire_rate" => 0,
        "move_speed" => 0,
        "magnet_radius" => 0
    ];

    $saveData = [
        "player_id" => $playerId,
        "credits" => $credits,
        "unlocked_ships" => array_values(array_unique($unlockedShips)),
        "upgrades" => $upgrades,
        "updated_at" => date("Y-m-d H:i:s")
    ];

    $allSaves = readJsonFile($saveJsonPath, []);
    $allSaves[$playerId] = $saveData;
    writeJsonFile($saveJsonPath, $allSaves);

    echo json_encode(["status" => "success", "message" => "Game state saved successfully", "save" => $saveData]);
    exit();
}
