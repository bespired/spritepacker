<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class createSqlite extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create:sqlite';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create sqlite from config.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {

        $filename = config('database.connections.sqlite.database');

        if (!file_exists($filename))
        {
            file_put_contents($filename, '');
            $this->info('Created sqlite file ' . $filename . '.');
        }else{
            $this->info('Sqlite file '.$filename.' already exists.');
        }

    }
}
