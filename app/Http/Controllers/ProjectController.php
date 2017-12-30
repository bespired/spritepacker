<?php

namespace App\Http\Controllers;

use App\Eloquent\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{

    public function index()
    {

        return $this->folderlist();
    }

    public function show($find)
    {
        $sprites = [];

        $projects = $this->folderlist();
        $project = (object)collect($projects)->firstWhere('folder', $find);

        $projectpath= public_path('projects'). '/' .$find;
        $pattern = sprintf('%s/sprites/%s', $projectpath, '*.{png,jpg}' );
        foreach (glob($pattern,GLOB_BRACE) as $filename) {

            $sprites[] = (object)[
                'name'   => basename($filename),
                'url'    => url('projects/' . $find. '/sprites/' . basename($filename)),
                'size'   => getimagesize ($filename),
                'load'   => false,
                'loaded' => false,
            ];
        }

        $project->sprites = $sprites;

        $jsonfilename = sprintf('%s/%s.json', $projectpath, $find );
        if (file_exists($jsonfilename)){
             $settings = json_decode(file_get_contents($jsonfilename));
             $project->settings = $settings->meta;
             $project->json = $jsonfilename;
        }

        return json_encode($project);
    }


    public function img(Request $request)
    {

        $image   = $request->get('imgBase64');
        if ( strlen($image) > 4000000) return;

        $prjct   = $request->get('project');
        if ( !$prjct ) return;

        $projects = $this->folderlist();
        $project = (object)collect($projects)->firstWhere('folder', $prjct['folder']);

        $img      = str_replace('data:image/png;base64,', '', $image);
        $img      = str_replace(' ', '+', $img);
        $fileData = base64_decode($img);

        $pngfile  = $project->folder . '.png';
        $jsonfile = $project->folder . '.json';
        $projectpath= public_path('projects'). '/' .$project->folder . '/';

        $fileName = $projectpath . $pngfile;
        file_put_contents($fileName, $fileData);

        $imgsize  = getimagesize($fileName);
        $filesize = filesize($fileName);

        $fileFormat = json_encode($request->get('file'));
        $fileFormat = str_replace('$w', $imgsize[0], $fileFormat);
        $fileFormat = str_replace('$h', $imgsize[1], $fileFormat);
        $fileFormat = str_replace('$image', $pngfile, $fileFormat);

        $fileName = $projectpath . $jsonfile;
        file_put_contents($fileName, $fileFormat);

        return [
            'status'   => 'saved',
            'filesize' => $filesize,
        ];

    }

    private function folderlist()
    {
        $pattern     = sprintf('%s/*', public_path('projects'));
        $dirs = array_filter(glob($pattern), 'is_dir');

        $projects = [];
        foreach ($dirs as $idx => $dirname) {
            $projects[]= [
                'id'       => 1 + $idx,
                'name'     => ucwords(str_replace('-', ' ', basename($dirname))),
                'folder'   => basename($dirname),
            ];
        }
        return $projects;
    }

    public function start($find)
    {

        $projects = $this->folderlist();
        $project = (object)collect($projects)->firstWhere('folder', $find);

        return view('index')
            ->with('project',   $project);
    }

    public function remove(Request $request)
    {

        $prjct   = $request->get('project');
        if ( !$prjct ) return;

        $projects = $this->folderlist();
        $project = (object)collect($projects)->firstWhere('folder', $prjct['folder']);

        if (!$project) return;

        $list   = $request->get('remove');
        foreach ($list as $sprite) {

        }
        print_r($list);

    }

}
