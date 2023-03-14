
class ColumnType{
	[string]$name
}
class Column{
	[string]$name
	[string]$primitive
	[boolean]$required
	[boolean]$unique
	[ColumnType[]]$column_type
}
class Entity {
    [string]$name
	[Column[]]$column
}

echo ******************************************************* "*** Create new Files For Entity***" ******************************************************* 
#$entity = [Entity]::new()
#$entity.name = Read-Host -Prompt 'Entity Name'

$functions = "Create", "List", "Update", "Delete"
$actions =  "create", "findMany", "update", "delete"
$from_params =  "body", "query", "body", "body"
$url_action =  "post", "get", "patch", "delete"

$diretorio_atual=(Get-Item .).FullName
$TemplateParameterFileLocal="$diretorio_atual\entity.JSON"
$entity = Get-Content $TemplateParameterFileLocal | Out-String | ConvertFrom-Json

#foreach ($item_entity in $entity) {
#	$name=$item_entity.name
#	echo "Entity Name: $name"
#	foreach ($item_column in $item_entity.column) {
#		$column_name=$item_column.name
#		$column_primitive=$item_column.primitive
#		$column_required=$item_column.required
#		$column_unique=$item_column.unique
#		echo "	Column Name: $column_name"
#		echo "	Column Primitive: $column_primitive"
#		echo "	Column Required: $column_required"
#		echo "	Column Unique: $column_unique"
#	}
#}

$unique_list_column=""
$interface_column=""
$role_list=""
$columns_list=""
$controller_param=""
$controller_list=""
$required_code=""
$required_column_list=""
$where = "`n"
$data = "`n"
$list_enum_1=""
$list_enum_2=""
$enum_list=""
$router=""
$data_required=""
Get-ChildItem -Path "$diretorio_atual" -Include "routes.ts" -File -Recurse | foreach { $_.Delete()}
Copy-Item -Path "$diretorio_atual\_routes.template" -Destination "$diretorio_atual\routes.ts" -Recurse
Set-Location "$diretorio_atual"
		
foreach ($item_entity in $entity) {
	$name = $item_entity.name
	echo "Entity Name: $name"
	foreach ($item_column in $item_entity.column) {
		$column=$item_column.name
		$primitive=$item_column.primitive
		$required=$item_column.required
		$unique=$item_column.unique
		echo "	Column Name: $column"
		echo "	Column Primitive: $primitive"
		echo "	Column Required: $required"
		echo "	Column Unique: $unique"
		if($required){
			$required_code += "	if(! ${column} ){      throw new Error(""'${column}' Required"")    } `n"
			
			$interface_column +=  "	${column} : ${primitive}; `n"
		}else{
			$interface_column +=  "	${column}? : ${primitive}; `n"
		}
		$column_init += "	$column : undefined, `n"
		if($unique){			
			$unique_list_column += "${column} : ${column}, `n"
		}
		$auto_column = !(($column -eq "created_by") -or ($column -eq "updated_by"))
		if($auto_column){
			$columns_list +=  $column + ", "
		}
		$controller_param +=  "	"+$column + ", `n"	
		$is_enum = ($primitive -like "*Enum*")
		if ($is_enum) {
			$role_list = $role_list + $item_column.column_type + ","
			foreach ($item_type in $item_column.column_type) {
				$type = $item_type.name
				$list_enum_1 += "$type : '$type' `n"
				$list_enum_2 += "$type' : '$type', `n"
			}
			$enum_list += "export const ${primitive} : {
	${list_enum_1}
}= {
	${list_enum_2}
}
export type ${primitive} = typeof ${primitive}[keyof typeof ${primitive}]; `n"
			$controller_list += "	${column} :  ${primitive} [${column}], `n"
		}else{
			$controller_list += "	${column} :  ${column}, `n"			
		}
		
		$where += "	if(${column} !== undefined) query.where = {...query.where, ${column} : ${column}}; `n"
		$data +=  "	if(${column} !== undefined) query.data = {...query.data, ${column} : ${column}}; `n"
	}
	$entity_lower = $entity.name.ToLower()
	if(!($unique_list_column -eq "")){
		$unique_code = "const unique = await prismaClient.$entity_lower.findFirst({
	  where:{
		#id_check#
		${unique_list_column}
	  }
	})
	if(unique){
	  throw new Error(""${name} already exists"")
	}";	
	}
	if(!($role_list -eq "")){
		$role_list = $role_list.Substring(0,$role_list.Length-1)
	}
	if(!($role_list -eq "")){
		$import_role='import {$role_list} from "../../interface";'
	}
	$columns_list = $columns_list.Substring(0,$columns_list.Length-1)


	
	$index = 0
	$diretorio_atual=(Get-Item .).FullName
	foreach ($function in $functions) {
		$function_lower = $function.ToLower()
		
		echo ******COPYING CONTROLLER******
		echo "=>entity: $name"
		echo "=>entity_lower: $entity_lower"
		echo "=>columns_list: $columns_list"
		echo "=>interface_column: $interface_column"
		echo "=>function: $function"
		echo "=>controller_param: $controller_param"
		echo "=>required_code: $required_code"
		echo "=>unique_code: $unique_code"
		echo "=>where: $where"
		echo "=>data: $data"
		echo "=>action: $action"
		echo "=>function_lower: $function_lower"
		$from_param = $from_params[$index]
		if($from_param -eq "query"){
			$controller_request = "const { $columns_list } = req.$from_param as unknown as ${name}Request;"
			$interface_request = ", ${name}Request"
		}else{
			$controller_request = "const { $columns_list } = req.$from_param;"
			$interface_request = ""
		}
		echo "=>controller_request: $controller_request"
		echo "=>interface_request: $interface_request"
		
		#copiando o arquivo controller
		if (!(Test-Path -Path "$diretorio_atual\controllers\$entity_lower")) { mkdir "$diretorio_atual\controllers\$entity_lower"}
		$controller_file = $function+$name+"Controller.ts"
		Get-ChildItem -Path "$diretorio_atual\controllers\$entity_lower" -Include "$controller_file" -File -Recurse | foreach { $_.Delete()}
		Copy-Item -Path "$diretorio_atual\_controller.template" -Destination "$diretorio_atual\controllers\$entity_lower" -Recurse
		
		Set-Location "$diretorio_atual\controllers\$entity_lower"		
		Get-ChildItem -File -Recurse | % { Rename-Item -Path $_.PSPath -NewName $_.Name.replace("_controller.template","$controller_file")}
		$addedFiles = Get-ChildItem . $controller_file -rec		
		"const { #columns_list# } = req.#from_param#;"
		foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#import_role#",$import_role }| Set-Content $file.PSPath}
		foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#function#",$function }| Set-Content $file.PSPath}
		foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#entity#",$name }| Set-Content $file.PSPath}
		foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#entity_lower#",$entity_lower }| Set-Content $file.PSPath}
		foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#columns_list#",$columns_list }| Set-Content $file.PSPath}
		
		foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#controller_request#",$controller_request }| Set-Content $file.PSPath}
		foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#function_lower#",$function_lower }| Set-Content $file.PSPath}
		foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#controller_list#",$controller_list }| Set-Content $file.PSPath}
		foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#interface_request#",$interface_request }| Set-Content $file.PSPath}
		
		Set-Location "$diretorio_atual"
		
		#copiando o arquivo service
		echo ******COPYING SERVICE******
		echo "=>entity: $name"
		echo "=>entity_lower: $entity_lower"		
		echo "=>interface_column: $interface_column"
		echo "=>function: $function"
		echo "=>controller_param: $controller_param"
		echo "=>required_code: $required_code"
		echo "=>unique_code: $unique_code"
		echo "=>where: $where"
		echo "=>data: $data"
		echo "=>action: $action"
		echo "=>function_lower: $function_lower"
		
		if (!(Test-Path -Path "$diretorio_atual\services\$entity_lower")) { mkdir "$diretorio_atual\services\$entity_lower"}
		$service_file = "${function}${name}Service.ts"
		Get-ChildItem -Path "$diretorio_atual\services\$entity_lower" -Include "$service_file" -File -Recurse | foreach { $_.Delete()}
		
		Copy-Item -Path "$diretorio_atual\_service.template" -Destination "$diretorio_atual\services\$entity_lower" -Recurse
		Set-Location "$diretorio_atual\services\$entity_lower"
		Get-ChildItem -File -Recurse | % { Rename-Item -Path $_.PSPath -NewName $_.Name.replace("_service.template","$service_file")}
		
		$addedFiles = Get-ChildItem . $service_file -rec
		
		foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#entity#",$name }| Set-Content $file.PSPath}
		foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#entity_lower#",$entity_lower }| Set-Content $file.PSPath}
		foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#function#",$function }| Set-Content $file.PSPath}
		foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#interface_column#",$interface_column }| Set-Content $file.PSPath}
		foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#controller_param#",$controller_param }| Set-Content $file.PSPath}
		$init_query=""
		$id_check=""
		if($function -eq "Create"){
			$init_query="{data:{$column_init}}"
			foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#init_query#",$init_query }| Set-Content $file.PSPath}
			foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#required_code#",$required_code }| Set-Content $file.PSPath}
			foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#unique_code#",$unique_code }| Set-Content $file.PSPath}
			foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#where#","" }| Set-Content $file.PSPath}			
		}
		if($function -eq "Update"){
			$id_check=" NOT: {id: {equals: id,},},"
			$init_query="{where:{},data:{$column_init}}"
			$where="query.where = {...query.where, id : id};"
			foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#init_query#",$init_query }| Set-Content $file.PSPath}
			foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#required_code#",$required_code }| Set-Content $file.PSPath}
			foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#unique_code#",$unique_code }| Set-Content $file.PSPath}
		}
		if($function -eq "List"){
			$init_query="{where:{}}"
			foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#init_query#",$init_query }| Set-Content $file.PSPath}
			foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#unique_code#","" }| Set-Content $file.PSPath}
			foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#required_code#","" }| Set-Content $file.PSPath}
			foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#data#","" }| Set-Content $file.PSPath}
		}
		if($function -eq "Delete"){
			$init_query="{where:{}}"
			foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#init_query#",$init_query }| Set-Content $file.PSPath}
			foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#unique_code#","" }| Set-Content $file.PSPath}
			foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#required_code#","" }| Set-Content $file.PSPath}
			foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#data#","" }| Set-Content $file.PSPath}
		}
		
		foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#id_check#",$id_check }| Set-Content $file.PSPath}
		foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#where#",$where }| Set-Content $file.PSPath}
		foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#data#",$data }| Set-Content $file.PSPath}
		
		$action=$actions[$index]
		foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#action#",$action }| Set-Content $file.PSPath}
		
		Set-Location "$diretorio_atual"
		
		if(!($enum_list -eq "")){
			echo ******COPYING ENUM******
			Copy-Item -Path "$diretorio_atual\_enum.template" -Destination "$diretorio_atual\interface\enum.ts" -Recurse
			$enum_file = "$diretorio_atual\interface\enum.ts"
			Set-Location "$diretorio_atual\interface"
			Get-ChildItem -File -Recurse | % { Rename-Item -Path $_.PSPath -NewName $_.Name.replace("_enum.template","$enum_file")}
			
			$addedFiles = Get-ChildItem . $enum_file -rec
			
			foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#enum_list#",$enum_list }| Set-Content $file.PSPath}
			
			Set-Location "$diretorio_atual"	
		}
		echo ******COPYING ROUTE******
		$action_param=$url_action[$index]
		$router = "
import {${function}${name}Controller} from ""./controllers/$entity_lower/${function}${name}Controller"";
router.${action_param}('/$entity_lower', isAuthenticated, new ${function}${name}Controller().handle)
export { router };
		"
		Set-Location "$diretorio_atual"		
		$route_file = "routes.ts"
		
		echo "=>route_file: $route_file"
		echo "=>router: $router"
		
		
		$addedFiles = Get-ChildItem . $route_file
		foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "export { router };",$router }| Set-Content $file.PSPath}
		
		Set-Location "$diretorio_atual"	
		$index += 1
	}
}





