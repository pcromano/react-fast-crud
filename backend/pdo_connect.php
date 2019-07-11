<?php
    //if (isset($_SERVER['HTTP_HOST']) && !in_array($_SERVER['HTTP_HOST'],array('127.0.0.1','192.168.1.2','example.com'))) die('Restricted access');
    	
	$DbHost = 'localhost';
	$DbPass = 'dbpass';
	$DbName = 'dbuser';
	require_once('PDO.class.php');
    
	$PDO = new Db($DbHost, $DbName, $DbUser, $DbPass);
	$PDO->query('SET TIME_ZONE = "America/Toronto"');
    $PDO->query("SET sql_mode = ''");