<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'db.php'; // Veritabanı bağlantısı

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];

    // Kullanıcıyı kontrol et
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Eğer kullanıcı varsa, sıfırlama işlemini başlat
        $reset_token = bin2hex(random_bytes(16)); // Rastgele bir token oluştur
        $reset_url = "http://pomodoro_timer/reset_password.php?token=$reset_token";

        // Tokeni veritabanına kaydet
        $sql = "UPDATE users SET reset_token = ? WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $reset_token, $email);
        $stmt->execute();

        // Kullanıcıya e-posta gönder
        mail($email, "Password Reset", "Click the link to reset your password: $reset_url");
        echo "A password reset link has been sent to your email.";
    } else {
        echo "No user found with that email.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="style.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password</title>
</head>
<body>
    <h2>Forgot Password</h2>
    <form action="forgot_password.php" method="post">
        <label for="email">Enter your email:</label>
        <input type="email" name="email" id="email" required><br><br>
        <button type="submit">Send Reset Link</button>
    </form>
</body>
</html>
