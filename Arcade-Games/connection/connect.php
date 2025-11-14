<?php

$host="localhost";
$user="root";
$pass="";
$db="game";
$conn=new mysqli($host, $user, $pass, $db);
if($conn->connect_error)
{
  echo"Failed to connect Database".$conn->connect_error;
}

?>