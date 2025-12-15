<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true displayMessage=!messagesPerField.existsError('username'); section>
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
                                <p class="text-3xl font-bold tracking-tight text-white">¿Olvidaste tu contraseña?</p>
                                <p class="mt-2 text-white/80">No te preocupes, te enviaremos un correo para que puedas recuperarla.</p>
                            </div>
                        </div>

                        <!-- Right Panel - Form -->
                        <div class="flex items-center justify-center p-6 sm:p-12 bg-background-light dark:bg-background-dark">
                            <div class="w-full max-w-md space-y-8">
                                <div class="flex min-w-72 flex-col gap-2 text-center lg:text-left">
                                    <p class="text-[#0d131b] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Recuperar Contraseña</p>
                                    <p class="text-[#4c6c9a] dark:text-slate-400 text-base font-normal leading-normal">Ingresa tu correo electrónico o nombre de usuario y te enviaremos un enlace para restablecer tu contraseña.</p>
                                </div>

                                <#if message?has_content>
                                    <div class="p-4 rounded-lg ${(message.type == 'error')?then('bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800', 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800')}">
                                        ${message.summary?no_esc}
                                    </div>
                                </#if>

                                <form id="kc-reset-password-form" action="${url.loginAction}" method="post">
                                    <div class="space-y-6">
                                        <label class="flex flex-col min-w-40 flex-1">
                                            <p class="text-[#0d131b] dark:text-slate-300 text-base font-medium leading-normal pb-2">
                                                <#if !realm.loginWithEmailAllowed>Usuario<#elseif !realm.registrationEmailAsUsername>Usuario o Correo Electrónico<#else>Correo Electrónico</#if> *
                                            </p>
                                            <input required autofocus type="text" id="username" name="username" value="${(auth.attemptedUsername!'')}" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d131b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfd9e7] dark:border-slate-700 bg-background-light dark:bg-slate-800 focus:border-primary h-14 placeholder:text-[#4c6c9a] dark:placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal" placeholder="Ingresa tu usuario o correo" aria-invalid="<#if messagesPerField.existsError('username')>true</#if>" />
                                            <#if messagesPerField.existsError('username')>
                                                <span class="text-sm text-red-600 dark:text-red-400 mt-1">${kcSanitize(messagesPerField.get('username'))?no_esc}</span>
                                            </#if>
                                        </label>

                                        <button type="submit" class="flex h-14 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                                            Enviar Enlace de Recuperación
                                        </button>
                                    </div>
                                </form>

                                <div class="flex items-center justify-center gap-2">
                                    <a class="text-base font-medium text-primary hover:underline" href="${url.loginUrl}">
                                        ← Volver al inicio de sesión
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
