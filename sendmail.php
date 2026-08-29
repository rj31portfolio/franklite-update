<?php
// Check if form submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form values
    $name = htmlspecialchars($_POST['fullname']);
    $email = htmlspecialchars($_POST['email']);
    $phone = htmlspecialchars($_POST['phone']);
    $subject = htmlspecialchars($_POST['subject']);
    $message = htmlspecialchars($_POST['message']);

    // Recipient
    $to = "franklite@gmail.com";

    // Email subject
    $mail_subject = "Contact Form Submission: $subject";

    // Email body
    $body = "You have received a new message from your website contact form.\n\n" .
            "Full Name: $name\n" .
            "Email: $email\n" .
            "Phone: $phone\n" .
            "Subject: $subject\n" .
            "Message:\n$message";

    // Headers
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";

    // Send email
    if (mail($to, $mail_subject, $body, $headers)) {
        echo "<script>alert('Message sent successfully!'); window.location.href='index.html';</script>";
    } else {
        echo "<script>alert('Failed to send message. Try again later.'); window.location.href='index.html';</script>";
    }
} else {
    // If accessed directly, redirect to homepage
    header("Location: index.html");
    exit;
}
?>
