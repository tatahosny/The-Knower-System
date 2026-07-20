<?php
$files = explode("\n", trim(shell_exec('find app/Modules -name "*Request.php" -size 0')));
foreach ($files as $file) {
    if (empty($file)) continue;
    preg_match('/app\/Modules\/([A-Za-z0-9_]+)\/Requests\/([A-Za-z0-9_]+)\.php/', $file, $matches);
    if (count($matches) === 3) {
        $module = $matches[1];
        $class = $matches[2];
        $content = "<?php\n\nnamespace App\\Modules\\$module\\Requests;\n\nuse Illuminate\\Foundation\\Http\\FormRequest;\n\nclass $class extends FormRequest\n{\n    public function authorize(): bool\n    { return true; }\n\n    public function rules(): array\n    { return []; }\n}\n";
        file_put_contents($file, $content);
        echo "Fixed $file\n";
    }
}
