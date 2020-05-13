<?php

$point = isset($_GET["point"]) ? $_GET["point"] : 0;
if($point > 0){
	file_put_contents("score.txt", $point);
}
?>