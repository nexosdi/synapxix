<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true; section>
    <#if section = "form">
    <div class="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
        <div class="layout-container flex h-full grow flex-col">
            <div class="flex flex-1 justify-center">
                <div class="layout-content-container flex flex-col w-full flex-1">
                    <div class="grid min-h-screen grid-cols-1 lg:grid-cols-2">
                        <!-- Left Panel - YouTube Video -->
                        <div class="relative hidden lg:flex h-full flex-col justify-between p-12 bg-gradient-to-br from-blue-600 to-indigo-700">
                            <div class="relative z-10">
                                <a class="flex items-center gap-3" href="#">
                                    <svg class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L2 7V17L12 22L22 17V7L12 2ZM12 4.437L19.531 8.5V15.5L12 19.563L4.469 15.5V8.5L12 4.437Z"></path>
                                    </svg>
                                    <span class="text-2xl font-bold tracking-tight text-white">Synapxix</span>
                                </a>
                            </div>
                            
                            <!-- YouTube Video Embed -->
                            <div class="relative z-10 flex-1 flex items-center justify-center py-8">
                                <div class="w-full max-w-2xl">
                                    <div class="relative w-full" style="padding-bottom: 56.25%;">
                                        <iframe 
                                            class="absolute top-0 left-0 w-full h-full rounded-xl shadow-2xl"
                                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=0&controls=1&loop=1&playlist=dQw4w9WgXcQ" 
                                            title="YouTube video player" 
                                            frameborder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                            allowfullscreen>
                                        </iframe>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="relative z-10">
                                <p class="text-3xl font-bold tracking-tight text-white">¡Revisa tu correo!</p>
                                <p class="mt-2 text-white/80">Te hemos enviado las instrucciones para recuperar tu contraseña.</p>
                            </div>
                        </div>

                        <!-- Right Panel - Success Message -->
                        <div class="flex items-center justify-center p-6 sm:p-12 bg-background-light dark:bg-background-dark">
                            <div class="w-full max-w-md space-y-8">
                                <!-- Success Icon -->
                                <div class="flex justify-center">
                                    <div class="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                        <svg class="h-10 w-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"></path>
                                        </svg>
                                    </div>
                                </div>

                                <div class="flex min-w-72 flex-col gap-2 text-center">
                                    <p class="text-[#0d131b] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Correo Enviado</p>
                                    <p class="text-[#4c6c9a] dark:text-slate-400 text-base font-normal leading-normal">Te hemos enviado un correo electrónico con las instrucciones para restablecer tu contraseña.</p>
                                </div>

                                <div class="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                    <p class="text-sm text-blue-800 dark:text-blue-200">
                                        <strong>¿No recibiste el correo?</strong><br/>
                                        Revisa tu carpeta de spam o correo no deseado. El correo puede tardar unos minutos en llegar.
                                    </p>
                                </div>

                                <div class="flex flex-col gap-3">
                                    <a href="${url.loginUrl}" class="flex h-14 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary/90">
                                        Volver al inicio de sesión
                                    </a>
                                    
                                    <a href="${url.loginResetCredentialsUrl}" class="flex h-14 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-slate-800 px-5 py-3 text-base font-semibold text-slate-900 dark:text-white shadow-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-700">
                                        Reenviar correo
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </#if>
</@layout.registrationLayout>
