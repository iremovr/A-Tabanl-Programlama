<?php
session_start();
include 'db.php';

// Kullanıcı bilgilerini al
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id']; // Kullanıcı IDsini al
    $date = date('Y-m-d'); // Günün tarihini al
    $end_time = date('H:i:s'); // Çıkış saatini al

    // Çalışma saatlerini güncelle
    $sql = "UPDATE work_hours 
            SET end_time = ?, hours_worked = TIME_TO_SEC(TIMEDIFF(?, start_time)) / 3600 
            WHERE user_id = ? AND work_date = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("ssis", $end_time, $end_time, $user_id, $date);
        $stmt->execute();
        $stmt->close();
    } else {
        echo "Work hours update error: " . htmlspecialchars($conn->error);
    }
}

// Oturumu sonlandır
session_unset(); // Oturum değişkenlerini temizle
session_destroy(); // Oturumu yok et

// Ana sayfaya yönlendir
header("Location: index.html");
exit;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="style.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logout</title>
</head>
<body>
    <p>You have been logged out. <a href="index.html">Return to Home</a>.</p>
</body>
</html>
