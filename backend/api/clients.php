<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

$DbName = 'cas'; #CAS database
#$DbName = 'ycfc_loans'; #Beta database
#$DbName = 'ycfc_system'; #CMC database
require_once('../pdo_connect.php');
require('../checkToken.php');

$table = 'clientinfo';
$userFields = "firstName,LastName,MiddleName,branchId,dateOfBirth,a.address,barangay,city,zipcode,contact,civilStatus,gender,id_presented,remarks";
$defaultOrder = 'firstName';
switch($_REQUEST['action']) {
    case 'schema':
        $civilStatus = [];
        $civilStatus[] = ['id'=>'single','value'=>'Single'];
        $civilStatus[] = ['id'=>'married','value'=>'Married'];
        $civilStatus[] = ['id'=>'widow','value'=>'Widow'];
        $civilStatus[] = ['id'=>'widower','value'=>'Widower'];
        $gender = [];
        $gender[] = ['id'=>'M','value'=>'Male'];
        $gender[] = ['id'=>'F','value'=>'Female'];
        
        $schema = [
        ['name'=>'firstName', 'label'=>'First name', 'required'=>true, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>true, 'type'=>'text'],
        ['name'=>'LastName', 'label'=>'Last name', 'required'=>true, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>true, 'type'=>'text'],
        ['name'=>'MiddleName', 'label'=>'Middle name', 'required'=>false, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>true, 'type'=>'text'],
        ['name'=>'dateOfBirth', 'label'=>'Date of Birth', 'required'=>true, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>false, 'type'=>'text', 'placeholder' => 'yyyy-mm-dd'],
        ['name'=>'address', 'label'=>'Address', 'required'=>true, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>true, 'type'=>'text'],
        ['name'=>'barangay', 'label'=>'Barangay', 'required'=>false, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>true, 'type'=>'text'],    
        ['name'=>'city', 'label'=>'City', 'required'=>true, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>true, 'type'=>'text'],    
        ['name'=>'zipcode', 'label'=>'Zipcode', 'required'=>false, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>false, 'type'=>'text'],    
        ['name'=>'contact', 'label'=>'Contact #', 'required'=>true, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>true, 'type'=>'text'],    
        ['name'=>'id_presented', 'label'=>'Presented ID', 'required'=>false, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>false, 'type'=>'text'],   
        ['name'=>'branchId', 'label'=>'Branch', 'required'=>true, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>true, 'type'=>'select', 'items'=>[]],
        ['name'=>'civilStatus', 'label'=>'Civil Status', 'required'=>true, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>false, 'type'=>'select', 
            'items'=>$civilStatus],    
        ['name'=>'gender', 'label'=>'Gender', 'required'=>true, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>false, 'type'=>'select', 'items'=>$gender],    
        ['name'=>'remarks', 'label'=>'Remarks', 'required'=>false, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>false, 'type'=>'textarea'],
        ['name'=>'image', 'label'=>'Photo', 'required'=>false, 'value'=>'', 'error'=>'', 'numeric'=>false, 'showInList'=>false, 'type'=>'image']
        ];
        echo json_encode($schema);
        break;
    case 'select': /*select record to edit */
        $id = $_POST['id'];
        $res = $PDO->queryAssoc('select a.id,'.$userFields.',branchname,image  from '.$table.' as a
                left join branches as b on branchId=b.id 
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
        if ($id) {
            $updateStr = implode('=?,',$Fields).'=?';
            array_push($FieldValues,$id);
            $PDO->query("update $table set $updateStr, dateModified=now(), modifiedBy=$userid where id=?", $FieldValues);
        } else {
            $sFields = implode(',',$Fields);
            $res = $PDO->query("insert into $table ($sFields,dateAdded,addedBy) value(".implode(',',$q).",now(),$userid)",$FieldValues);    
            $id = $PDO->lastInsertId;
        }
        
        $data = ($PDO->error ? ['error'=>$PDO->error] : ['result'=>'success','id'=>$id]);
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
            $arrSearch = explode(' ',$search);
            $matchAgainst = [];
            foreach($arrSearch as $v) {
                $matchAgainst[] = 'match(firstName,lastName) against("*'.addslashes($v).'*" in boolean mode)';
            }
            $matchAgainst = implode(' and ',$matchAgainst);
            
            $res = $PDO->queryAssoc('select a.id,'.$userFields.',branchname,a.active from '.$table.' as a
                left join branches as b on branchId=b.id 
                where 
                a.active=1 '.$wherebranchId.' and
                '.$matchAgainst.'
                 order by trim('.$order_by.') '.$order. 
                    ' limit '.$page_limit.','.$per_page);
        } else {    
            $res = $PDO->queryAssoc('select a.id,'.$userFields.',branchname,a.active
                from '.$table.' as a
                left join branches as b on branchId=b.id 
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