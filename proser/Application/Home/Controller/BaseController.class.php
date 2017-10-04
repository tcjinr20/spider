<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/10/4
 * Time: 17:21
 */

namespace Home\Controller;


use Think\Controller;

class BaseController extends Controller
{
    public function _initialize(){
        $this->title="互联网web数据处理";
    }
}