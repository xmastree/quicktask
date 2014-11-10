<?php
/**
 * Global Constants
 */
define ('DS', DIRECTORY_SEPARATOR);
define ('WWW_PATH', dirname(__FILE__) . DS);

require 'Template.php';
require 'TemplateRequest.php';

$TemplateRequest = new TemplateRequest();

try {
    $TemplateRequest->delegate();
} catch (Exception $e) {
    header(' ', true, 400);
    echo $e->getMessage();
}