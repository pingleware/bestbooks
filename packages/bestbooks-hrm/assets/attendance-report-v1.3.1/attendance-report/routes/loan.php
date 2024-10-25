<?php
use WeDevs\PM_Pro\Core\Router\Router;
use WeDevs\PM\Core\Permissions\Authentic;
use WeDevs\PM\Core\Permissions\Access_Project;
use WeDevs\PM\Core\Permissions\Project_Manage_Capability;

$router = Router::singleton();

$router->get( 'projects/{project_id}/invoice', 'WeDevs\PM_Pro\Modules\invoice\src\Controllers\Invoice_Controller@index' )
->permission([Access_Project::class]);
$router->get( 'invoices', 'WeDevs\PM_Pro\Modules\invoice\src\Controllers\Invoice_Controller@index' )
->permission([Authentic::class]);
$router->get( 'projects/{project_id}/invoice/{invoice_id}', 'WeDevs\PM_Pro\Modules\invoice\src\Controllers\Invoice_Controller@show' )
->permission([Access_Project::class]);
$router->get( 'projects/{project_id}/invoice/{invoice_id}/pdf', 'WeDevs\PM_Pro\Modules\invoice\src\Controllers\Invoice_Controller@PDF' )
->permission([Access_Project::class]);
$router->post( 'projects/{project_id}/invoice/{invoice_id}', 'WeDevs\PM_Pro\Modules\invoice\src\Controllers\Invoice_Controller@update' )
->permission([Project_Manage_Capability::class]);
$router->post( 'projects/{project_id}/invoice/{invoice_id}/payment', 'WeDevs\PM_Pro\Modules\invoice\src\Controllers\Invoice_Controller@payment' )
->permission([Access_Project::class]);
$router->delete( 'projects/{project_id}/invoice/{invoice_id}', 'WeDevs\PM_Pro\Modules\invoice\src\Controllers\Invoice_Controller@destroy' )
->permission([Project_Manage_Capability::class]);
$router->post( 'projects/{project_id}/invoice/{invoice_id}/mail', 'WeDevs\PM_Pro\Modules\invoice\src\Controllers\Invoice_Controller@mail' )
->permission([Project_Manage_Capability::class]);
$router->post( 'invoice/address', 'WeDevs\PM_Pro\Modules\invoice\src\Controllers\Invoice_Controller@address' )
->permission([Authentic::class]);
$router->get( 'invoice/user-address/user/{user_id}', 'WeDevs\PM_Pro\Modules\invoice\src\Controllers\Invoice_Controller@get_user_address' )
->permission([Authentic::class]);
$router->post( 'invoice/user-address/user/{user_id}', 'WeDevs\PM_Pro\Modules\invoice\src\Controllers\Invoice_Controller@save_user_address' )
->permission([Authentic::class]);

$router->post( 'projects/{project_id}/invoice', 'WeDevs\PM_Pro\Modules\invoice\src\Controllers\Invoice_Controller@store' )
->permission([Access_Project::class]);
$router->post( 'projects/{project_id}/invoice/{invoice_id}/gateway_payment', 'WeDevs\PM_Pro\Modules\invoice\src\Controllers\Invoice_Controller@gateway_payment' )
->permission([Access_Project::class]);