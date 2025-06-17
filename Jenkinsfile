@Library('Shared') _ 

pipeline { 
    agent {
        node {
        label 'cocktail'
        }
    }
    
    tools {
        nodejs 'node18'  // Name you gave in Global Tool Configuration
    }
    
     environment{
        SONAR_HOME = tool "Sonar"
    }

    parameters {
        string(name: 'FRONTEND_DOCKER_TAG', defaultValue: 'latest', description: 'Setting docker image tag for latest push')
    }

    stages {
        
      
        stage("Validate Parameters") {
            steps {
                script {
                    if (!params.FRONTEND_DOCKER_TAG?.trim()) {
                        error("Parameter FRONTEND_DOCKER_TAG cannot be empty.")
                    }
                }
            }
        }
        
        stage("Workspace cleanup"){
            steps{
                script{
                    cleanWs()
                }
            }
        }
        
        stage('Git: Code Checkout') { 
            steps { 
                script { 
                    code_checkout("https://github.com/kunalborkar2001/cocktails_adrian", "main") 
                } 
            } 
        } 
        
        stage("Trivy: Filesystem scan"){
            steps{
                script{
                    trivy_scan()
                }
            }
        }
        
        stage("OWASP: Dependency check"){
            steps{
                script{
                    owasp_dependency()
                }
            }
        }
        
        stage("SonarQube: Code Analysis") {
            agent { label 'master' }
            environment {
        SONAR_HOME = tool "Sonar"
    }
                steps {
                    script {
                        sonarqube_analysis("Sonar", "wanderlust", "wanderlust")
                        }
                    }
        }

stage("SonarQube: Code Quality Gates") {
    agent { label 'master' }
    environment {
        SONAR_HOME = tool "Sonar"
    }
    steps {
        script {
            sonarqube_code_quality()
        }
    }
}



        stage("Docker: Build Images") { 
            steps { 
                script { 
                    docker_build("cocktail_adrian", params.FRONTEND_DOCKER_TAG, "kunalborkar2001") 
                } 
            } 
        } 

        stage("Docker: Push to DockerHub") { 
            steps { 
                script { 
                    docker_push("cocktail_adrian", params.FRONTEND_DOCKER_TAG, "kunalborkar2001") 
                } 
            } 
        } 
    } 
    
     post{
        success{
            archiveArtifacts artifacts: '*.xml', followSymlinks: false
            build job: "cocktail-CD", parameters: [
                string(name: 'FRONTEND_DOCKER_TAG', value: "${params.FRONTEND_DOCKER_TAG}"),
            ]
            script {
                emailext attachLog: true,
                from: 'trainwithshubham@gmail.com',
                subject: "Wanderlust Application has been updated and deployed - '${currentBuild.result}'",
                body: """
                    <html>
                    <body>
                        <div style="background-color: #FFA07A; padding: 10px; margin-bottom: 10px;">
                            <p style="color: black; font-weight: bold;">Project: ${env.JOB_NAME}</p>
                        </div>
                        <div style="background-color: #90EE90; padding: 10px; margin-bottom: 10px;">
                            <p style="color: black; font-weight: bold;">Build Number: ${env.BUILD_NUMBER}</p>
                        </div>
                        <div style="background-color: #87CEEB; padding: 10px; margin-bottom: 10px;">
                            <p style="color: black; font-weight: bold;">URL: ${env.BUILD_URL}</p>
                        </div>
                    </body>
                    </html>
            """,
            to: 'kunalborkar2001@gmail.com',
            mimeType: 'text/html'
            }
        }
        
    }
}
