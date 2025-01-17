<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'db.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Kullanıcıyı veritabanına kaydet
    $sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("sss", $username, $email, $hashed_password);
        
        if ($stmt->execute()) {
            echo "Registration successful! <a href='login.php'>Login here</a>";
        } else {
            echo "Error: " . htmlspecialchars($stmt->error);
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
    <title>Sign Up</title>
</head>
<body>
    <h2>Sign Up</h2>
    <form action="register.php" method="post">
        <label for="username">Username:</label>
        <!-- Kullanıcı adı girişi -->
        <input type="text" name="username" id="username" required><br><br>
        <label for="email">Email:</label>
         <!-- Email girişi -->
        <input type="email" name="email" id="email" required><br><br>
        <label for="password">Password:</label>
         <!-- Şifre girişi -->
        <input type="password" name="password" id="password" required><br><br>
        <!-- Kayıt ol butonu -->
        <button type="submit">Sign up</button>
    </form>
</body>
</html>
