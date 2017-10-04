<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/10/4
 * Time: 17:19
 */

namespace Home\Controller;


use Think\Controller;

class AdminController extends Controller
{
    public $filter =['login','logout'];
    public function _initialize(){
        $this->title="互联网web数据处理";
        if(in_array(ACTION_NAME,$this->filter)){

        }else{
            if(is_login()){

            }else{
                $this->redirect("/user/login");
            }
        }
    }

    public function getUser(){
        return $_SESSION['user'];
    }
}