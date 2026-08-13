<?php
// Cyber Strike: Neon Vanguard - Leaderboard API

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $scores = [];

    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT player_name, score, wave, ship_type, kills, created_at FROM high_scores ORDER BY score DESC LIMIT 50");
            $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $scores = [];
        }
    }

    if (empty($scores)) {
        // Load JSON or initialize default seeded scores
        $defaultScores = [
            ["player_name" => "CYBER_ACE", "score" => 125000, "wave" => 28, "ship_type" => "Titan", "kills" => 482, "created_at" => date("Y-m-d H:i:s", strtotime("-1 hours"))],
            ["player_name" => "NEON_VIPER", "score" => 98400, "wave" => 24, "ship_type" => "Phantom", "kills" => 395, "created_at" => date("Y-m-d H:i:s", strtotime("-3 hours"))],
            ["player_name" => "VANGUARD_01", "score" => 76200, "wave" => 19, "ship_type" => "Vanguard", "kills" => 310, "created_at" => date("Y-m-d H:i:s", strtotime("-5 hours"))],
            ["player_name" => "GHOST_RUNNER", "score" => 54100, "wave" => 15, "ship_type" => "Phantom", "kills" => 220, "created_at" => date("Y-m-d H:i:s", strtotime("-1 day"))],
            ["player_name" => "TITAN_CRUSHER", "score" => 41800, "wave" => 12, "ship_type" => "Titan", "kills" => 175, "created_at" => date("Y-m-d H:i:s", strtotime("-2 days"))]
        ];
        $scores = readJsonFile($scoresJsonPath, $defaultScores);
        // Sort DESC
        usort($scores, function($a, $b) {
            return $b['score'] - $a['score'];
        });
    }

    echo json_encode(["status" => "success", "leaderboard" => array_slice($scores, 0, 50)]);
    exit();
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid JSON payload"]);
        exit();
    }

    $playerName = !empty($input['player_name']) ? substr(trim(strip_tags($input['player_name'])), 0, 16) : 'PILOT_' . rand(100, 999);
    $score = isset($input['score']) ? intval($input['score']) : 0;
    $wave = isset($input['wave']) ? intval($input['wave']) : 1;
    $shipType = !empty($input['ship_type']) ? strip_tags($input['ship_type']) : 'Vanguard';
    $kills = isset($input['kills']) ? intval($input['kills']) : 0;
    $createdAt = date("Y-m-d H:i:s");

    $newEntry = [
        "player_name" => strtoupper($playerName),
        "score" => $score,
        "wave" => $wave,
        "ship_type" => $shipType,
        "kills" => $kills,
        "created_at" => $createdAt
    ];

    if ($pdo) {
        try {
            $stmt = $pdo->prepare("INSERT INTO high_scores (player_name, score, wave, ship_type, kills, created_at) VALUES (:name, :score, :wave, :ship, :kills, :created)");
            $stmt->execute([
                ':name' => $newEntry['player_name'],
                ':score' => $newEntry['score'],
                ':wave' => $newEntry['wave'],
                ':ship' => $newEntry['ship_type'],
                ':kills' => $newEntry['kills'],
                ':created' => $createdAt
            ]);
        } catch (Exception $e) {
            // Fall back to JSON file
        }
    }

    // Save to JSON storage as well
    $currentScores = readJsonFile($scoresJsonPath, []);
    $currentScores[] = $newEntry;
    usort($currentScores, function($a, $b) {
        return $b['score'] - $a['score'];
    });
    writeJsonFile($scoresJsonPath, array_slice($currentScores, 0, 100));

    // Update global stats
    $stats = readJsonFile($statsJsonPath, ["total_games" => 0, "total_kills" => 0, "highest_score" => 0]);
    $stats["total_games"] += 1;
    $stats["total_kills"] += $kills;
    if ($score > $stats["highest_score"]) {
        $stats["highest_score"] = $score;
    }
    writeJsonFile($statsJsonPath, $stats);

    // Calculate rank
    $rank = 1;
    foreach ($currentScores as $index => $item) {
        if ($item['score'] === $score && $item['player_name'] === $newEntry['player_name']) {
            $rank = $index + 1;
            break;
        }
    }

    echo json_encode([
        "status" => "success",
        "message" => "Score submitted successfully!",
        "rank" => $rank,
        "entry" => $newEntry
    ]);
    exit();
}
