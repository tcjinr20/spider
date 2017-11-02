<?php
namespace Build\Controller;
use Think\Controller;
class IndexController extends Controller {
    public function index(){
        $this->display();
    }

    public function objist(){
        $w=[];
        $w['objtype']='obj';
        $arr=M('obj')->where($w)->select();
        $this->list=$arr;
        $this->display('list');
    }

    public function scenelist(){
        $w=[];
        $w['objtype']='scene';
        $arr=M('obj')->where($w)->select();
        $this->list=$arr;
        $this->display('list');
    }

    public function projectlist(){
        $w=[];
        $w['objtype']='app';
        $arr=M('obj')->where($w)->select();
        $this->list=$arr;
        $this->display('list');
    }

    public function editor(){
        if(isMobile()){
            C('DEFAULT_THEME','mobile');
        }
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
                $ww['pid']=$arr[0]['id'];
                $child=M('child')->where($ww)->select();
                $this->ajaxReturn(array(code=>1,obj=>$arr[0],'child'=>$child));
            }else{
                $this->ajaxReturn(array(code=>0));
            }
        }
    }

    public function saveChild(){
        ini_set('max_execution_time', '0');
        $upload = new \Think\Upload();
        $upload->rootPath=THINK_PATH;
        $upload->savePath="../Public/upload/";
        $upload->autoSub = TRUE;
        $info=$upload->upload();
        $res = [code=>1];
        if($info){
            $d=array();
            $d['pid'] =I('pid');
            $d['type']=I('type');
            $d['josnurl']=str_replace('..','',$info['file']['savepath'].$info['file']['savename']);
            $res['id']=M("child")->add($d);
            $this->ajaxReturn($res);
        }else{
            $res['code']=0;
            $res['error']= $upload->error;
            $this->ajaxReturn($res);
        }
    }

    public function upload(){
        ini_set('max_execution_time', '600');
        $upload = new \Think\Upload();
        $upload->rootPath=THINK_PATH;
        $upload->savePath="../Public/upload/";
        $upload->autoSub = TRUE;
        $info=$upload->upload();
        $res = [code=>1];
        if($info){
            $d=array();
            $d['objurl']=str_replace('..','',$info['file']['savepath'].$info['file']['savename']);
            $d['imgurl']=str_replace('..','',$info['img']['savepath'].$info['img']['savename']);
            $d['fileext']=$info['file']['ext'];
            $d['objtype']=$_POST['type'];
            $d['name']=$_POST['name'];
            $d['desc']=$_POST['desc'];
            $res['id']=M("obj")->add($d);
            $this->ajaxReturn($res);
        }else{
            $res['code']=0;
            $this->ajaxReturn($res);
        }
    }
}