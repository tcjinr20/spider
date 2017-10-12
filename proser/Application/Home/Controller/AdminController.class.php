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
    public $__filter =['login','logout'];
    public function _initialize(){
        $this->title="互联网web数据处理";
        if(!$this->filter(ACTION_NAME)){
            if(is_login()){

            }else{
                if(IS_AJAX){
                    $this->ajaxReturn(['code'=>1005]);
                    exit();
                }else{
                    $this->redirect("/user/login");
                }
            }
        }
    }

    public function filter($action){
        return in_array($action,$this->__filter);
    }

    public function getUser(){
        return $_SESSION['user'];
    }

    public function getUserID(){
        return $_SESSION['user']['id'];
    }
}