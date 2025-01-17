<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'db.php';
session_start();

// Kullanıcı zaten giriş yaptıysa profile.php'ye yönlendir
if (isset($_SESSION['user_id'])) {
    header("Location: profile.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Veritabanından kullanıcıyı al
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            // Şifreyi doğrula
            if (password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];

                // Kullanıcının temasını al ve oturuma kaydet
                $theme = $user['theme'] ?? 'light';
                $_SESSION['theme'] = $theme;

                echo "Login successful! Welcome, " . htmlspecialchars($user['username']);
                echo "<br><a href='index.html'>Go to Home</a>";
            } else {
                echo "Invalid password.";
            }
        } else {
            echo "No user found with that email.";
        }

        $stmt->close();
    } else {
        echo "Database error: " . htmlspecialchars($conn->error);
    }

    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="style.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
</head>
<body>
    <h2>Login</h2>
    <form action="login.php" method="post">
        <label for="email">Email:</label>
        <input type="email" name="email" id="email" required><br><br>
        <label for="password">Password:</label>
        <input type="password" name="password" id="password" required><br><br>
        <button type="submit">Login</button>
    </form>
    <!-- Kullanıcı şifresini unuttuysa -->
    <p>Forgot your password? <a href="forgot_password.php">Reset it here</a>.</p>
    <!-- Kullanıcının hesabı yoksa -->
    <p>Don't have an account? <a href="register.php">Sign up here</a>.</p>
</body>
</html>
