<?php

/**
 * Class RequestHandler
 *
 * @property Template $_Template
 */

class TemplateRequest
{

    /**
     * Template instance
     *
     * @var Template
     */
    protected $_Template;

    public function __construct() {
        $this->_Template = new Template();
    }

    /**
     * Delegate actions by request method
     */
    public function delegate()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $this->_delegateGET($_GET);
        } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $this->_delegatePOST($_POST);
        } else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            $this->_delegateDELETE($_GET);
        }
    }

    protected function _delegateGET(array $request)
    {
        header('Content-Type: application/json');

        if (!empty($request) && isset($request['__template'])) {
            $templateFileName = $request['__template'];

            //if exist only __template - read data
            if (count($request) == 1) {
                $response = $this->_Template->getData($request['__template']);
            }
            //if request has more params - generate result
            else {
                unset($request['__template']);
                $templateParams = $request;

                $response = $this->_Template->generateOutputText($templateFileName, $templateParams);
            }
        }
        //if empty request - get list of templates
        else {
            $response = $this->_Template->getList();
        }

        echo json_encode($response);
    }

    protected function _delegatePOST(array $request)
    {
        header('Content-Type: application/json');

        if (!empty($request)) {
            $this->_Template->save($request);
        }
    }

    protected function _delegateDELETE(array $request)
    {
        if (!empty($request)) {
            $this->_Template->delete($request['__template']);
        }
    }
}