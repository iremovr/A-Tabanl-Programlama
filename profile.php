<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'db.php';
session_start();

// Kullanıcı oturumunu kontrol et
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php"); // Giriş yapılmamışsa login sayfasına yönlendir
    exit;
}

$user_id = $_SESSION['user_id'];
$username = $_SESSION['username'] ?? 'Guest';
$theme = $_SESSION['theme'];

// Toplam çalışma saatini sorgula
$sql = "SELECT SUM(hours_worked) AS total_hours FROM work_hours WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$total_hours = 0;

if ($stmt) {
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    // Toplam çalışma saatini al
    if ($row = $result->fetch_assoc()) {
        $total_hours = $row['total_hours'] ?? 0;
    }
    
    $stmt->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="style.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile</title>
</head>
<body class="<?php echo htmlspecialchars($theme); ?>"> <!-- Temaya göre body sınıfı -->
    <h1>Welcome, <?php echo htmlspecialchars($username); ?>!</h1>
    <p>This is your profile page.</p>
    <!-- Toplam çalışma saati -->
    <p>Total Hours Worked: <?php echo number_format($total_hours, 2); ?> hours</p>
    <!-- Şifre değiştirme -->
    <a href="change_password.php" class="button">Change Password</a>
    <!-- Çıkış -->
    <a href="logout.php">Logout</a>
</body>
</html>
