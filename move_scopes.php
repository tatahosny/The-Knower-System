<?php
function replaceInAllFiles($search, $replace) {
    $dirs = ['app/', 'database/', 'routes/'];
    foreach ($dirs as $dir) {
        if (!is_dir($dir)) continue;
        $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
        foreach ($iterator as $file) {
            if ($file->isFile() && $file->getExtension() === 'php') {
                $content = file_get_contents($file->getRealPath());
                $newContent = str_replace($search, $replace, $content);
                if ($content !== $newContent) {
                    file_put_contents($file->getRealPath(), $newContent);
                }
            }
        }
    }
}

if (is_dir('app/Models/Scopes')) {
    @mkdir('app/Core/Scopes', 0777, true);
    $files = scandir('app/Models/Scopes');
    foreach ($files as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'php') {
            rename("app/Models/Scopes/$file", "app/Core/Scopes/$file");
            replaceInAllFiles('App\Models\Scopes', 'App\Core\Scopes');
            $c = file_get_contents("app/Core/Scopes/$file");
            $c = str_replace('namespace App\Models\Scopes;', 'namespace App\Core\Scopes;', $c);
            file_put_contents("app/Core/Scopes/$file", $c);
        }
    }
}
echo "Scopes moved.\n";
