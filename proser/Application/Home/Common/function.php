<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/10/4
 * Time: 17:47
 */

function is_login(){
    return $_SESSION['user']?1:0;
}