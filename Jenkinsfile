pipeline {
    agent any
    environment {
        PATH_PROJECT = '/var/www/laravel'
        SONAR_PROJECT_KEY = 'thang1610200_laravel_AY0vjgwR8-iSJNTe88UN'
        SONAR_HOST_URL = 'http://34.121.240.164:9000'
        SONAR_TOKEN = credentials('token-laravel-ticket')
    }

    stages {
        stage('Check sourse'){
            steps {
                script {
                    //sh ('sudo chown -R jenkins:jenkins /var/lib/jenkins/workspace')
                    sh ('sudo cp -r . $PATH_PROJECT')
                    echo 'Success'
                }
            }
        }

        stage('SonarQube Test') {
            steps {
                script {
                    sh "sonar-scanner \
                            -Dsonar.projectKey=$SONAR_PROJECT_KEY \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=$SONAR_HOST_URL \
                            -Dsonar.login=$SONAR_TOKEN"
                }
            }
        }

        stage('Build'){
            steps{
                script {
                    println GIT_BRANCH
                    sh ('cd $PATH_PROJECT')
                    sh ('sudo docker-compose up --build -d')
                }
            }
        }

        stage('Composer'){
            steps{
                script {
                    sh ("sudo docker exec laravel-php-1 bash -c 'composer update'")
                    sh ("sudo docker exec laravel-php-1 bash -c 'chown www-data:www-data -R ./storage'")
                }
            }
        }

        stage('Migrate And Seeder'){
            steps{
                script{
                    try {
                        timeout(time: 5, unit: 'MINUTES'){
                            env.userChoice = input message: "Migrate ?",
                                parameters: [choice(name: 'Versioning Service', choices: 'no\nyes', description: 'Chọn "yes" để migrate!')]
                        }

                        if(env.userChoice == 'yes'){
                            sh ("sudo docker exec laravel-php-1 bash -c 'php artisan migrate'")
                            sh ("sudo docker exec laravel-php-1 bash -c 'php artisan db:seed'")
                        }else{
                            echo 'Next'
                        }
                    }
                    catch(Exception error){
                        echo 'Hủy migrate'
                    }
                }
            }
        }   
    }
}