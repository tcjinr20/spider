<?php
namespace Build\Controller;
use Think\Controller;
class IndexController extends Controller {
    public function index(){
        $this->display();
    }

    public function modelist(){
        $w=[];
        $w['objtype']='scene';
        $arr=M('obj')->where($w)->select();
        $this->list=$arr;
        $this->display();
    }

    public function editor(){
//        if(isMobile){
//        C('DEFAULT_THEME','theme/mobile');
            $this->display();
//        }else{
//            $this->display();
//        }
    }

    public function upload(){
        $_FILES['file']['name']=$_POST['filename'];
        $upload = new \Think\Upload();
        $upload->rootPath=THINK_PATH;
        $upload->savePath="../Public/upload/";
        $upload->autoSub = TRUE;
        $info=$upload->upload();
        $d=array();
        $d['objurl']=str_replace($info['file']['savepath'].$info['file']['savename'],'..','');
        $d['name']=$_POST['filename'];
        $d['desc']=$_POST['filename'];
        M("obj")->add($d);
        $this->ajaxReturn($info);
    }
}