<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require_once('../pdo_connect.php');
require('../checkToken.php');

$table = 'user';

$userFields = "firstname,lastname,username,email,contact,password,branchId,role_id";
$defaultOrder = 'firstname';
switch($_REQUEST['action']) {
    case 'schema':
        $schema = [
        ['name'=>'username', 'label'=>'Username', 'required'=>true, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>true, 'type'=>'text'],
        ['name'=>'password', 'label'=>'Password', 'required'=>true, 'value'=>'ycfccas19', 'error'=>'', 'numeric'=>false, 'showInList'=>false, 'type'=>'text', 'gridsize'=>4], 
        ['name'=>'email', 'label'=>'Email', 'required'=>true, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>true, 'type'=>'text', 'gridsize'=>4],
        ['name'=>'firstname', 'label'=>'First name', 'required'=>true, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>true, 'type'=>'text'],
        ['name'=>'lastname', 'label'=>'Last name', 'required'=>true, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>true, 'type'=>'text'],
        ['name'=>'contact', 'label'=>'Contact #', 'required'=>true, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>true, 'type'=>'text', 'gridsize'=>4],    
        ['name'=>'role_id', 'label'=>'Role', 'required'=>true, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>true, 'type'=>'select', 'items'=>[], 'gridsize'=>6],
        ['name'=>'branchId', 'label'=>'Branch', 'required'=>true, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>true, 'type'=>'select', 'items'=>[], 'gridsize'=>6]
        
        ];
        echo json_encode($schema);
        break;
    case 'select': /*select record to edit */
        $id = $_POST['id'];
        $res = $PDO->queryAssoc('select a.id,'.$userFields.',branchname,a.active,last_login, c.name as rolename  from '.$table.' as a
                left join branches as b on branchId=b.id 
                left join roles as c on role_id=c.id
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
        $PDO->query('update '.$table.' set active=0,deleted=1 where id=?',[$id]);  
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
        $newpass = md5($_POST['password']);
        if ($id) {
            $updateStr = implode('=?,',$Fields).'=?';
            array_push($FieldValues,$id);
            $PDO->query("update $table set $updateStr, dateModified=now(), modifiedBy=$userid, newpass='$newpass' where id=?", $FieldValues);
        } else {
            $sFields = implode(',',$Fields);
            $PDO->query("insert into $table ($sFields,dateAdded,addedBy,newpass) value(".implode(',',$q).",now(),$userid,'$newpass')",$FieldValues);
        }
        
        $data = ($PDO->error ? ['error'=>$PDO->error] : ['result'=>'success','id'=>$PDO->lastInsertId]);
        echo json_encode($data);  
        break;    
    default: /* list */
        $per_page = isset($_POST['rowsPerPage']) && $_POST['rowsPerPage'] ? intval($_POST['rowsPerPage']) : 25;
        $page = isset($_POST['page']) && $_POST['page']>0 ? intval($_POST['page']) : 0;
        $page_limit = $page * $per_page;
        
        $date = isset($_POST['date']) ? $_POST['date'] : date('Y-m-d');
        
        $search = isset($_POST['searchFor']) && $_POST['searchFor'] ? trim($_POST['searchFor']) : '';
        $branchId = isset($_POST['branchId']) && $_POST['branchId'] ? $_POST['branchId'] : '';
        
        $wherebranchId = $branchId ? ' and branchId='.$branchId : '';
        
        if ($search) {  
            $rec_count = $PDO->single('select count(*) from '.$table.' 
                where active=1 '.$wherebranchId.' and
                match(firstName,lastName) against("*'.addslashes($search).'*" in boolean mode)');
        } else {
            $rec_count = $PDO->single('select count(*) from '.$table.' 
                where active=1 '.$wherebranchId);
        }
        $rec_count = intval($rec_count);
        
        $total_pages = floor($rec_count/$per_page);
        $total_pages = $total_pages > 0 ? $total_pages : 0;
        
        $order_by = isset($_POST['orderBy']) && $_POST['orderBy'] ? $_POST['orderBy'] : $defaultOrder;
        $order = isset($_POST['order']) && $_POST['order'] ? $_POST['order'] : 'asc';
        
        if ($search) {    
            $res = [];
            $res = $PDO->queryAssoc('select a.id,'.$userFields.',branchname,a.active,last_login, c.name as rolename from '.$table.' as a
                left join branches as b on branchId=b.id 
                left join roles as c on role_id=c.id
                where 
                a.active=1 '.$wherebranchId.' and
                match(firstName,lastName) against("*'.addslashes($search).'*" in boolean mode) order by trim('.$order_by.') '.$order. 
                    ' limit '.$page_limit.','.$per_page);
        } else {    
            $res = $PDO->queryAssoc('select a.id,'.$userFields.',branchname,a.active,last_login, c.name as rolename
                from '.$table.' as a
                left join branches as b on branchId=b.id 
                left join roles as c on role_id=c.id
                where a.active=1 '.$wherebranchId.'
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