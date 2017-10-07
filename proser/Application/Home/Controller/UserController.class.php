<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/10/4
 * Time: 14:53
 */

namespace Home\Controller;


use Think\Controller;

class UserController extends AdminController
{
    public function login(){
        if(IS_POST){
            if(I('act')=="reg"){
                $w['username']= I("username");
                if(I('password')!=I('repassword')){
                    $this->ajaxReturn(['code'=>1002]);
                }else if(M("User")->where($w)->select()){
                    $this->ajaxReturn(['code'=>1001]);
                }else{
                    $w['password']=md5(I('password'));
                    $w['regtime']=date("Y-m-d H:i:s");
                    M("User")->add($w);
                    $this->ajaxReturn(['code'=>1]);
                }
            }else if(I('act')=="log"){
                $w['password']=md5(I("password"));
                $w['username']= I("username");
                $user = M("User")->where($w)->select();
                if($user){
                    $_SESSION['user']=$user;
                    $this->ajaxReturn(['code'=>1]);
                }else{
                    $this->ajaxReturn(['code'=>1003]);
                }
            }
        }
        $this->display();
    }

    public function logout(){
        unset($_SESSION['user']);
        $this->redirect('/');
    }

    public function center(){
        $this->redirect('/');
//        $this->display();
    }

    public function putToExcel(){
        vendor("PHPExcel.PHPExcel");
    }

    public function putToCvs(){
        $task = I("id",0);
        $level = I('level');
        if(empty($task)||empty($level)){
            exit("参数错误");
        }
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="user.csv"');
        header('Cache-Control: max-age=0');
        $key = array();
        $page = 0;
        $fp = fopen('php://output', 'w') or die("can't open php://output");
        $puthead = true;
        while($atask = D("Task")->getOutOpt($task,$level,1000,$page)){
            $page++;
            foreach($atask as $k=>$v){
                $ar = json_decode($v['content']);
                $item = [];
                foreach($ar as $bv){
                    foreach($bv as $kl=>$vl){
                        $key[]=$kl;
                        $item[]=iconv("utf-8","utf-8",$vl);
                    }
                }
                $item[]=$v['url'];
                if($puthead){
                    $key[]='数据来源';
                    fputcsv($fp,$key);
                    $puthead=false;
                }
                fputcsv($fp,$item);
            }
        }
        fclose($fp);
    }

}