<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require_once('../pdo_connect.php');
require('../checkToken.php');

$table = 'branches';

$userFields = "branchname,address";
$defaultOrder = 'branchname';
switch($_REQUEST['action']) {
    case 'schema':
        $schema = [
        ['name'=>'branchname', 'label'=>'Branch Name', 'required'=>true, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>true, 'type'=>'text', 'gridsize'=>12],
        ['name'=>'address', 'label'=>'Address', 'required'=>false, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>true, 'type'=>'text', 'gridsize'=>12]
        
        ];
        echo json_encode($schema);
        break;
    case 'select': /*select record to edit */
        $id = $_POST['id'];
        $res = $PDO->queryAssoc('select a.id,'.$userFields.'  from '.$table.' as a
                where a.id=?',[$id]);
                
        if (count($res)) {
            $data = ['rows'=>current($res)];
        }  else {
            $data = ['error'=>$PDO->error];
        }
        echo json_encode($data);
        break;
    case 'activetoggle':
        $id = $_POST['id'];
        $PDO->query('update '.$table.' set active=if(active=1,0,1) where id=?',[$id]);  
        $data = $PDO->error ? ['error'=>$PDO->error] : ['result'=>'success'];
        echo json_encode($data);
        break;
    case 'delete':
        $id = $_POST['id'];
        $PDO->query('update '.$table.' set active=0, deleted=1 where id=?',[$id]);  
        $data = $PDO->error ? ['error'=>$PDO->error] : ['result'=>'success'];
        echo json_encode($data);
        break;
    case 'save':
        $id = $_POST['id'];
        $userFields = str_replace('a.','',$userFields);
        $Fields = explode(',',$userFields);
        $FieldValues = [];
        $q = [];
        foreach($Fields as $v) {
            $FieldValues[] = $_POST[$v];
            $q[] = '?';
        }
        if ($id) {
            $updateStr = implode('=?,',$Fields).'=?';
            array_push($FieldValues,$id);
            $PDO->query("update $table set $updateStr, dateModified=now(), modifiedBy=$userid where id=?", $FieldValues);
        } else {
            $sFields = implode(',',$Fields);
            $PDO->query("insert into $table ($sFields,dateAdded,addedBy) value(".implode(',',$q).",now(),$userid)",$FieldValues);
        }
        
        $data = ($PDO->error ? ['error'=>$PDO->error] : ['result'=>'success']);
        echo json_encode($data);  
        break;    
    default: /* list */
        $per_page = isset($_POST['rowsPerPage']) && $_POST['rowsPerPage'] ? intval($_POST['rowsPerPage']) : 25;
        $page = isset($_POST['page']) && $_POST['page']>0 ? intval($_POST['page']) : 0;
        $page_limit = $page * $per_page;
        
        $search = isset($_POST['searchFor']) && $_POST['searchFor'] ? trim($_POST['searchFor']) : '';
        
        if ($search) {  
            $rec_count = $PDO->single('select count(*) from '.$table.' 
                where deleted=0 and
                match(name,description) against("*'.addslashes($search).'*" in boolean mode)');
        } else {
            $rec_count = $PDO->single('select count(*) from '.$table.' 
                where deleted=0 ');
        }
        $rec_count = intval($rec_count);
        
        $total_pages = floor($rec_count/$per_page);
        $total_pages = $total_pages > 0 ? $total_pages : 0;
        
        $order_by = isset($_POST['orderBy']) && $_POST['orderBy'] ? $_POST['orderBy'] : $defaultOrder;
        $order = isset($_POST['order']) && $_POST['order'] ? $_POST['order'] : 'asc';
        
        if ($search) {    
            $res = [];
            $res = $PDO->queryAssoc('select id,'.$userFields.' from '.$table.',active
                where 
                deleted=0  and
                branchname like "%'.addslashes($search).'%" order by trim('.$order_by.') '.$order. 
                    ' limit '.$page_limit.','.$per_page);
        } else {    
            $res = $PDO->queryAssoc('select id,'.$userFields.',active
                from '.$table.'
                where deleted=0
                order by trim('.$order_by.') '.$order. 
                    ' limit '.$page_limit.','.$per_page);
        }
        
        $error = '';
        if ($PDO->error) {
            $error = $PDO->error;
        }
        $data = ['total'=>$rec_count, 'pages'=>$total_pages, 'rows'=>$res, 'error'=>$error];
        
        echo json_encode($data);
}

$PDO->CloseConnection();
?> 