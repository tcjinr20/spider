<?php
namespace Build\Controller;
use Think\Controller;
class IndexController extends Controller {
    public function index(){
        echo 1;
//        $this->display();
    }

    public function modelist(){
        $w=[];
        $w['objtype']='scene';
        $arr=M('obj')->where($w)->select();
        $this->list=$arr;
        $this->display();
    }

    public function editor(){
        $this->sceneid=I("id",0);

        $this->display();
    }

    public function ajaxScene(){
        if(empty(I("id"))){
            $this->ajaxReturn(array(code=>0));
        }else{
            $w['id']=I("id");
            $arr=M('obj')->where($w)->select();
            if($arr){
                $this->ajaxReturn(array(code=>1,obj=>$arr[0]));
            }else{
                $this->ajaxReturn(array(code=>0));
            }
        }
    }

    public function upload(){
        $upload = new \Think\Upload();
        $upload->rootPath=THINK_PATH;
        $upload->savePath="../Public/upload/";
        $upload->autoSub = TRUE;
        $info=$upload->upload();
        $d=array();
        $d['objurl']=str_replace('..','',$info['file']['savepath'].$info['file']['savename']);
        $d['imgurl']=str_replace('..','',$info['img']['savepath'].$info['img']['savename']);
        $d['fileext']=$info['file']['ext'];
        $d['objtype']=$_POST['type'];
        $d['name']=$_POST['name'];
        $d['desc']=$_POST['desc'];

        M("obj")->add($d);
        $this->ajaxReturn($info);
    }
}