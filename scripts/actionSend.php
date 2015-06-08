<?php
require 'vendor/autoload.php';
$errors = [];

if (!preg_match('/^[а-я]+\s[а-я]+$/ius', $_REQUEST['fullname'])) {
    $errors['fullname'] = 'field fullname probel';
}

if (!preg_match('/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/', strtolower($_REQUEST['email']))) {
    $errors['email'] = 'Please enter a valid email address';
}
if (!preg_match('/^[+]?[0-9]{6,15}$/', $_REQUEST['phone'])) {
    $errors['phone'] = 'Please enter a valid phone number';
}

if (!preg_match('/^[а-я]+$/ius', strtoupper($_REQUEST['country']))) {
    $errors['country'] = 'country error';
}

if (!preg_match('/^[а-я]+$/ius', strtoupper($_REQUEST['city']))) {
    $errors['city'] = 'city error';
}

if (!preg_match('/^[0-9]{2,10}$/', $_REQUEST['postal'])) {
    $errors['postal'] = 'Please enter a valid postal';
}

foreach($_REQUEST as $key => &$value) {
    if (empty($value)) {
        $errors[$key] = $key.' cannot be blank.';
        if ($key == 'str') {
            $errors[$key] = 'please choose product.';
        }
    }
}
if ($errors) {
    echo json_encode($errors);
    exit;
}
$string = $_REQUEST['str'];
$stringElements = explode('|', $string);

$delivery = ($_REQUEST['typeOfDelivery'] == 'true')? 'самовывоз': 'доставка';
$pay = ($_REQUEST['pay'] == 'true')? 'оплата оффлайн' : 'оплата картой';
$message = '<html>
        <head>
            <meta charset="utf-8">
        </head>
        <body>';

$message .= '<span style="font-weight: bold">Полное имя:</span> '.$_REQUEST['fullname'].'<br>'
        .'<span style="font-weight: bold">Email: </span>'.$_REQUEST['email'].'<br>'
        .'<span style="font-weight: bold">Телефон: </span>'.$_REQUEST['phone'].'<br>'
        .'<span style="font-weight: bold">Страна: </span>'.$_REQUEST['country'].'<br>'
        .'<span style="font-weight: bold">Город: </span>'.$_REQUEST['city'].'<br>'
        .'<span style="font-weight: bold">Улица/дом: </span>'.$_REQUEST['street'].'<br>'
        .'<span style="font-weight: bold">Индекс: </span>'.$_REQUEST['postal'].'<br>'
        .'<span style="font-weight: bold">Способ: </span>'.$delivery.'<br>'
        .'<span style="font-weight: bold">Способ оплаты: </span>'.$pay.'<br><br>'
        ;

$totalSum = 0;
$message .= '<table border="2">';
    $message .= '<caption>Список товаров</caption>';
    $message .= '<tr>';
        $message .= '<td>Товар</td>';
        $message .= '<td>Количество</td>';
        $message .= '<td>Стоимость</td>';
    $message .= '</tr>';
    for ($i=1; $i<count($stringElements); $i++) {
        $message .= '<tr>';
            $message .= '<td>'.$stringElements[$i++].'</td>';
            $message .= '<td>'.$stringElements[$i++].'</td>';
            $message .= '<td>'.$stringElements[$i].'</td>';
        $totalSum += $stringElements[$i];
        $message .= '</tr>';
    }
    if ($_REQUEST['typeOfDelivery'] == 'false') {
        $message .= '<tr>';
            $message .= '<td>Доставка</td>';
            $message .= '<td>1</td>';
            $message .= '<td>600</td>';
        $message .= '</tr>';
        $totalSum += 600;
    }
    $message .= '<tr>';
        $message .= '<td colspan="2">Общяя сума </td>';
        $message .= '<td>'.$totalSum.'</td>';
    $message .= '</tr>';
$message .= '</table>';
$message .= '</body></html>';

function sendEmail($message, $email){
    $mail = new PHPMailer();
    $mail->setFrom('alexandr.vasiliev@iqria.com');
    $mail->isHTML(true);
    $mail->Subject = 'Here is the subject';
    $mail->Body    = $message;
    $mail->addCustomHeader("Content-Type: text/html; charset=utf-8");
    $mail->addAddress($email);
    return $mail->send();
}
sendEmail($message, 'alexandr.vasiliev@iqria.com');
sendEmail($message, 'alexandr.sharygin@iqria.com');

