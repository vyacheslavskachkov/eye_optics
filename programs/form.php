<?php
$name = $_POST['name'];
$phone = $_POST['phone'];
$mail = $_POST['mail'];
$date = $_POST['date'];

$sender = "websender@internet.ru";
$recipient = "webrecipient@mail.ru";
$subject = "request";
$message = "\nName: " . $name . "\nPhone: " . $phone . "\nE-mail: " . $mail . "\nDate: " . $date;

if (mail($recipient, $subject, $message, "From: $sender")) {
    $answer = 'Thank you! We will contact you soon';
    $mark = 'green_mark';
} else {
    $answer = 'Error sending data. Please try again later';
    $mark = 'red_mark';
}
$response = ['answer' => $answer,'mark' => $mark];
header('Content-type: application/json');
echo json_encode($response);