<?php
session_start();
require 'db.php';

// Giriş yapılıp yapılmadığını kontrol et
if (!isset($_SESSION['user_id'])) {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    header("Location: login.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id']; // Oturumdaki kullanıcı ID'sini al
    $username = $_POST['username']; // Yeni kullanıcı adı
    $email = $_POST['email']; // Yeni e-posta adresi

    // Kullanıcı bilgilerini güncelleme
    $sql = "UPDATE users SET username = ?, email = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("ssi", $username, $email, $user_id);
        if ($stmt->execute()) {
            // Güncellenirse profil sayfasına yönlendir
            echo "Profile updated successfully!";
            header("Location: profile.php");
            exit;
        } else {
            echo "Error updating profile: " . htmlspecialchars($stmt->error);
        }
        $stmt->close();
    } else {
        echo "Database error: " . htmlspecialchars($conn->error);
    }

    $conn->close();
} else {
    echo "Invalid request method.";
    header("Location: profile.php");
    exit;
}
?>
