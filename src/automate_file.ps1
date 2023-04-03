
class ColumnType{
	[string]$name
	[string]$label
	[string]$parent
	[string]$parentKey
}
class Column{
	[string]$name
	[string]$label
	[string]$primitive
	[string]$table_type
	[boolean]$required
	[boolean]$unique
	[ColumnType[]]$column_type
	[boolean]$update
	[boolean]$disable
	[string]$type
	[string]$typeDiv
	[int]$size
	[boolean]$isCurrency
	[boolean]$isHyperlink
	[string]$path
	[string]$step
}
class Entity {
    [string]$name
	[Column[]]$column
	[string]$icon
	[string]$icon_path
}

echo ******************************************************* "*** Create new Files For Page***" ******************************************************* 

$diretorio_atual=(Get-Item .).FullName
$TemplateParameterFileLocal="$diretorio_atual\entity.JSON"
$entity = Get-Content $TemplateParameterFileLocal | Out-String | ConvertFrom-Json
$HANDLE_DELETE=""
$HANDLE_GET=""
Set-Location "$diretorio_atual"


foreach ($item_entity in $entity) {
	$select_cols=""
	$update_cols=""
	$param_props=""
	$param_props_col=""
	$enums_server_side="["	
	$default_columns=""
	$import_relation=""
	$name = $item_entity.name
	$list_relation_props=""
	$total_size=0
	$COLUMNS=""
	$query_server_side=""
	$param_server_side=""
	$interface_column=" id: string `n"
	$import_enum=""
	$param_icon=$item_entity.icon
	$param_icon_path=$item_entity.icon_path
	echo "Entity Name: $name"
	foreach ($item_column in $item_entity.column) {
		$total_size+=$item_column.size
	}
	foreach ($item_column in $item_entity.column) {
		$step_list=""
		$enum_item_col_1=""
		$enum_item_col_2=""
		$first_col=(1 -eq 1)
		$lookup=""
		$lookup_props=""
		$index_enum=0
		$values_param=""
		$enum_front_side="["
		$column=$item_column.name
		$primitive=$item_column.primitive
		$required=$item_column.required
		$unique=$item_column.unique
		$typeDiv=$item_column.typeDiv
		$type=$item_column.type
		$label=$item_column.label
		$disabled=$item_column.disable
		$path_server_side=$item_column.path
		$table_type=$item_column.table_type
		$step=$item_column.step
		$parentKey=""
		
		echo "	Column Name: $column"
		echo "	Column Primitive: $primitive"
		echo "	Column Required: $required"
		echo "	Column Unique: $unique"
		echo "	Column typeDiv: $typeDiv"
		echo "	Column type: $type"
		echo "	Column label: $label"
		echo "	Column disabled: $disabled"
		if($required){
			$interface_column +=  "	${column} : ${primitive} `n"
		}else{
			$interface_column +=  "	${column}? : ${primitive} `n"
		}		
		$default_columns += "	${column} : undefined,`n"
		$is_enum = ($primitive -like "*Enum*")
		if ($is_enum) {
			$export_enum+="export type $primitive = typeof $primitive[keyof typeof $primitive];`n"
			$import_enum+="$primitive,"
			$enums_server_side+="["
			foreach ($item_type in $item_column.column_type) {
				$type = $item_type.name
				$label_enum = $item_type.label
				$parentKey=$item_type.parentKey
				$enums_server_side+="	{""id"":$primitive.$type, ""value"":""$label_enum"", ""field"": ""${column}""}, `n"
				$enum_front_side+="	{""id"":$primitive.$type, ""value"":""$label_enum""}, `n"
				$enum_item_col_1+="$type : '$type'`n"
				$enum_item_col_2+="$type : '$type',"
			}
			$export_const_enum+="export const $primitive : {
    $enum_item_col_1
} = {
    $enum_item_col_2
}`n"
			$enums_server_side+="]"
			$lookup="enums[$index_enum]"
			$lookup_props=" enums, "
			$index_enum+=1
		}else{
			$is_props = ($primitive -like "*Props*")
			if($is_props){
				foreach ($item_type in $item_column.column_type) {
					$type = $item_type.name
					$parent = $item_type.parent
					$parentKey=$item_type.parentKey
				}
				$import_relation +="import { $primitive } from '../$type'; `n"
				$list_relation_props += "	${type}?: $primitive[] `n"
				$interface_column +=  "	${parent}? : $primitive[] `n"
				$param_props +=" ,$type "
				$query_server_side += "
	const $type = (await apiClient.get('$path_server_side')).data"
				$param_server_side += "	${type} : ${type}, `n"
				$param_props_col += ", ${type}?: $primitive[] "
				$values_param = " $type "
				$lookup=" $type "
				$lookup_props=" $type, "
				
			}
		}
		$enum_front_side+="]"
		if($enum_front_side -eq "[]"){
			if($values_param -eq ""){
				$values_list=""
			}else{
				$values_list="values: $values_param ? getArrayCombo(""$parentKey"" , $values_param) : [],"
			}
			
		}else{
			$values_list="values: $enum_front_side,"
		}
		if(!($step -eq "")){
			$step_list = "	step : ${step},"
		}else{
			$step_list = ""
		}
		if($disabled){
			$disabled_lower="true"
		}else{
			$disabled_lower="false"
		}
		if($required){
			$required_lower="true"
		}else{
			$required_lower="false"
		}
		if($item_column.update){
		$update_cols+="	{
      typeDiv: $typeDiv,
      type: ""$type"",
      required: $required_lower,
      label: ""$label"",
      autoComplete: ""off"",
      placeholder: ""$label"",
      jsonAttribute: ""$column"",
      value: param.$column,
      disabled: $disabled_lower,
	  ${step_list}
	  ${values_list}
    },`n"
		}
		$select_cols+=" {
      typeDiv: $typeDiv,
      type: ""$type"",
      required: $required_lower,
      label: ""$label"",
      autoComplete: ""off"",
      placeholder: ""$label"",
      jsonAttribute: ""$column"",
      value: param.$column,
      disabled: $disabled_lower,
	  ${step_list}
	  ${values_list}
    },`n"
		$percentual=100*($item_column.size/$total_size)
		$percentual=[math]::floor($percentual)
		$size_col=$item_column.size;
		$COLUMNS+="		{
		Header: '$label',
		minWidth: $size_col,`n"
		if($table_type -eq "boolean"){
		    $COLUMNS+="accessor: d => d.$column.toString(),`n"
		    $COLUMNS+="Filter: SelectColumnFilter,`n"
		    $COLUMNS+="filter: 'includes',`n"
		}else{
		    if($table_type -eq "numeric"){
                $COLUMNS+="accessor: d => d.$column,`n"
                $COLUMNS+="Filter: SelectColumnFilter,`n"
                $COLUMNS+="filter: 'includes',`n"
            }else{
                if($table_type -eq "string"){
                    $COLUMNS+="accessor: d => d.$column.toString(),`n"
                    $COLUMNS+="filter: 'fuzzyText',`n"
                }
            }
		}


		$COLUMNS+="},//${percentual}%`n"
		
	}
	$entity_lower = $name.ToLower()
	
	$HANDLE_DELETE+="import { ${name}RowDataProps } from ""../pages/${entity_lower}"";
export const handleRowDelete${name} = async (oldData: ${name}RowDataProps) => {
	const apiClient = setupAPIClient();
	await apiClient.delete('/${entity_lower}?id='+oldData.id);
}
#HANDLE_DELETE#`n"

	$HANDLE_GET+="import { ${name}RowDataProps } from ""../pages/${entity_lower}"";
export const handleRowGet${name} = async(me : UserProps) => {
    const apiClient = setupAPIClient();
    const ${entity_lower} : ${name}RowDataProps[] = (await apiClient.get('/${entity_lower}?created_by='+me.id)).data
    return ${entity_lower};
}
#HANDLE_GET#`n"
	$enums_server_side+="]"
	
	$diretorio_atual=(Get-Item .).FullName
	
	$IMPORT_LINKS += "import {${param_icon}} from '${param_icon_path}';
#IMPORT_LINKS#"
	$LINKS += "
            <Link href=""/${entity_lower}"">
				<${param_icon} color=""#FFF"" size={24}/>
            </Link>
#LINKS#"
	
	if(!($import_enum -eq "")){
		$import_enum = "import { $import_enum } from '../../utils/role';`n"
	}
	echo ******CREATING PAGE******
	echo "=>entity: $name"
	echo "=>entity_lower: $entity_lower"
	echo "=>interface_column: $interface_column"
	echo "=>enums_server_side: $enums_server_side"
	echo "=>default_columns: $default_columns"
	echo "=>import_relation: $import_relation"
	echo "=>list_relation_props: $list_relation_props"
	echo "=>param_props: $param_props"
	echo "=>select_cols: $select_cols"
	echo "=>update_cols: $update_cols"
	echo "=>param_props_col: $param_props_col"
	echo "=>query_server_side: $query_server_side"
	echo "=>param_server_side: $param_server_side"
	echo "=>import_enum: $import_enum"
	
	echo "=>COLUMNS: $COLUMNS"
	
	#copiando o arquivo controller
	$path="$diretorio_atual\pages\$entity_lower"
	if (!(Test-Path -Path "$path")) { mkdir "$path"}
	$template_file="_entity.template"
	$index_file = "index.tsx"
	Get-ChildItem -Path "$path" -Include "$index_file" -File -Recurse | foreach { $_.Delete()}
	Copy-Item -Path "$diretorio_atual\$template_file" -Destination "$path" -Recurse
	
	Set-Location "$path"
	Get-ChildItem -File -Recurse | % { Rename-Item -Path $_.PSPath -NewName $_.Name.replace("$template_file","$index_file")}
	$addedFiles = Get-ChildItem . $index_file -rec		
	
	foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#entity#",$name }| Set-Content $file.PSPath}
	foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#entity_lower#",$entity_lower }| Set-Content $file.PSPath}
	foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#interface_column#",$interface_column }| Set-Content $file.PSPath}
	foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#enums_server_side#","enums: $enums_server_side, " }| Set-Content $file.PSPath}
	foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#default_columns#",$default_columns }| Set-Content $file.PSPath}
	foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#import_relation#",$import_relation }| Set-Content $file.PSPath}
	foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#list_relation_props#",$list_relation_props }| Set-Content $file.PSPath}
	foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#param_props#",$param_props }| Set-Content $file.PSPath}
	foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#select_cols#",$select_cols }| Set-Content $file.PSPath}
	foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#update_cols#",$update_cols }| Set-Content $file.PSPath}
	foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#query_server_side#",$query_server_side }| Set-Content $file.PSPath}
	foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#param_server_side#",$param_server_side }| Set-Content $file.PSPath}
	
	foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#param_props_col#",$param_props_col }| Set-Content $file.PSPath}
	foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#COLUMNS#",$COLUMNS }| Set-Content $file.PSPath}
	foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#import_enum#",$import_enum }| Set-Content $file.PSPath}
	
	Set-Location "$diretorio_atual"
	
	echo ******CREATING HANDLE DELETE******
	echo "=>HANDLE_DELETE: $HANDLE_DELETE"
	
	$path="$diretorio_atual\utils"		
	
	if (!(Test-Path -Path "$path")) { mkdir "$path"}
	$template_file="_handleDelete.template"
	$index_file = "handleDelete.ts"
	Get-ChildItem -Path "$path" -Include "$index_file" -File -Recurse | foreach { $_.Delete()}
	Copy-Item -Path "$diretorio_atual\$template_file" -Destination "$path" -Recurse
	
	Set-Location "$path"
	Get-ChildItem -File -Recurse | % { Rename-Item -Path $_.PSPath -NewName $_.Name.replace("$template_file","$index_file")}
	$addedFiles = Get-ChildItem . $index_file -rec
	
	foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#HANDLE_DELETE#",$HANDLE_DELETE }| Set-Content $file.PSPath}
	
	Set-Location "$diretorio_atual"
	
	
	echo ******CREATING HANDLE GET******
	echo "=>HANDLE_GET: $HANDLE_GET"
	
	$path="$diretorio_atual\utils"		
	
	if (!(Test-Path -Path "$path")) { mkdir "$path"}
	$template_file="_handleGet.template"
	$index_file = "handleGet.ts"
	Get-ChildItem -Path "$path" -Include "$index_file" -File -Recurse | foreach { $_.Delete()}
	Copy-Item -Path "$diretorio_atual\$template_file" -Destination "$path" -Recurse
	
	Set-Location "$path"
	Get-ChildItem -File -Recurse | % { Rename-Item -Path $_.PSPath -NewName $_.Name.replace("$template_file","$index_file")}
	$addedFiles = Get-ChildItem . $index_file -rec
	
	foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#HANDLE_GET#",$HANDLE_GET }| Set-Content $file.PSPath}
	
	Set-Location "$diretorio_atual"
	
	echo ******CREATING ROUTES******
	echo "=>IMPORT_LINKS: $IMPORT_LINKS"
	echo "=>LINKS: $LINKS"
	
	$path="$diretorio_atual\utils"		
	
	if (!(Test-Path -Path "$path")) { mkdir "$path"}
	$template_file="_router.template"
	$index_file = "router.tsx"
	Get-ChildItem -Path "$path" -Include "$index_file" -File -Recurse | foreach { $_.Delete()}
	Copy-Item -Path "$diretorio_atual\$template_file" -Destination "$path" -Recurse
	
	Set-Location "$path"
	Get-ChildItem -File -Recurse | % { Rename-Item -Path $_.PSPath -NewName $_.Name.replace("$template_file","$index_file")}
	$addedFiles = Get-ChildItem . $index_file -rec
	
	foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#IMPORT_LINKS#",$IMPORT_LINKS }| Set-Content $file.PSPath}
	foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#LINKS#",$LINKS }| Set-Content $file.PSPath}
	
	Set-Location "$diretorio_atual"
	
	Set-Location "$diretorio_atual"
	

	
	
	
}

echo ******CREATING ENUMS******
echo "=>export_enum: $export_enum"
echo "=>export_const_enum: $export_const_enum"

$path="$diretorio_atual\utils"		

if (!(Test-Path -Path "$path")) { mkdir "$path"}
$template_file="_role.template"
$index_file = "role.tsx"
Get-ChildItem -Path "$path" -Include "$index_file" -File -Recurse | foreach { $_.Delete()}
Copy-Item -Path "$diretorio_atual\$template_file" -Destination "$path" -Recurse

Set-Location "$path"
Get-ChildItem -File -Recurse | % { Rename-Item -Path $_.PSPath -NewName $_.Name.replace("$template_file","$index_file")}
$addedFiles = Get-ChildItem . $index_file -rec

foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#export_enum#",$export_enum }| Set-Content $file.PSPath}
foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#export_const_enum#",$export_const_enum }| Set-Content $file.PSPath}

Set-Location "$diretorio_atual"
	

echo ******CLEANING******

$path="$diretorio_atual\utils"

$template_file="_handleDelete.template"
$index_file = "handleDelete.ts"
Set-Location "$path"
$addedFiles = Get-ChildItem . $index_file -rec

foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#HANDLE_DELETE#","" }| Set-Content $file.PSPath}

Set-Location "$diretorio_atual"

$path="$diretorio_atual\utils"		
$index_file = "handleGet.ts"

Set-Location "$path"
$addedFiles = Get-ChildItem . $index_file -rec

foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#HANDLE_GET#","" }| Set-Content $file.PSPath}

Set-Location "$diretorio_atual"

$path="$diretorio_atual\utils"		
$index_file = "router.tsx"

Set-Location "$path"
$addedFiles = Get-ChildItem . $index_file -rec

foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#IMPORT_LINKS#","" }| Set-Content $file.PSPath}
foreach ($file in $addedFiles){(Get-Content $file.PSPath) | Foreach-Object { $_ -replace "#LINKS#","" }| Set-Content $file.PSPath}

Set-Location "$diretorio_atual"