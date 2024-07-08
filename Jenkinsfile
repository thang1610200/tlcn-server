pipeline{
    agent any
    environment {
        PATH_PROJECT = '/var/www'
    }

    stages {
        stage('clean workspace'){
            steps{
                cleanWs()
            }
        }
        stage('Checkout from Git'){
            steps{
                git branch: 'main', url: 'https://github.com/thang1610200/tlcn-server.git'
            }
        }
        stage('Docker Build & Push'){
            withCredentials([file(credentialsId: 'Server', keyFileVariable: 'PRIVATE_KEY_FILE')]) {
                sh ('PRIVATE_KEY_FILE')
            }
        }
        // stage("Docker Build & Push"){
        //     steps{
        //         script{
        //            withDockerRegistry(credentialsId: 'docker', toolName: 'docker'){   
        //                sh "docker build -t bingo ."
        //                sh "docker tag bingo aseemakram19/bingo:latest "
        //                sh "docker push aseemakram19/bingo:latest "
        //             }
        //         }
        //     }
        // }
        // stage('Deploy to container'){
        //     steps{
        //         sh 'docker run -d --name bingo -p 3000:3000 aseemakram19/bingo:latest'
        //     }
        // }

    }
}