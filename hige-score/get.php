<?php
header("Access-Control-Allow-Origin: *");

$score = file_get_contents("score.txt");
echo json_encode(array("score" => $score));

?>