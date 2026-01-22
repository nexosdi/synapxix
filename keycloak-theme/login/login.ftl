<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displayInfo displayWide=(realm.password && social.providers??); section>
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
                                    <img src="${url.resourcesPath}/img/logo.png" alt="Synapxix" class="h-8 w-8 object-contain" />
                                    <span class="text-2xl font-bold tracking-tight text-white">Synapxix</span>
                                </a>
                            </div>
                            
                            <!-- YouTube Video Embed -->
                            <div class="relative z-10 flex-1 flex items-center justify-center py-8">
                                <div class="w-full max-w-2xl">
                                    <div class="relative w-full" style="padding-bottom: 56.25%;">
                                        <video
                                            class="absolute top-0 left-0 w-full h-full rounded-xl shadow-2xl object-cover"
                                            autoplay
                                            loop
                                            muted
                                            playsinline
                                            poster="${url.resourcesPath}/img/video-poster.jpg">
                                            <source src="${url.resourcesPath}/video/bg-video.mp4" type="video/mp4">
                                            <!-- Fallback a una imagen si el video falla -->
                                            <img src="${url.resourcesPath}/img/video-poster.jpg" alt="Synapxix Promo" class="w-full h-full object-cover rounded-xl">
                                        </video>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="relative z-10">
                                <p class="text-3xl font-bold tracking-tight text-white">¡Bienvenido a tu aventura!</p>
                                <p class="mt-2 text-white/80">Inicia sesión para jugar, aprender y divertirte con tus amigos.</p>
                            </div>
                        </div>

                        <!-- Right Panel - Form -->
                        <div class="flex items-center justify-center p-6 sm:p-12 bg-background-light dark:bg-background-dark">
                            <div class="w-full max-w-md space-y-8">
                                <div class="flex min-w-72 flex-col gap-2 text-center lg:text-left">
                                    <p class="text-[#0d131b] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Bienvenido</p>
                                    <p class="text-[#4c6c9a] dark:text-slate-400 text-base font-normal leading-normal">Por favor ingresa tus datos para iniciar sesión.</p>
                                </div>

                                <#if message?has_content>
                                    <div class="p-4 rounded-lg ${(message.type == 'error')?then('bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800', 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800')}">
                                        ${message.summary?no_esc}
                                    </div>
                                </#if>

                                <#if realm.password>
                                    <form id="kc-form-login" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
                                        <div class="space-y-6">
                                            <label class="flex flex-col min-w-40 flex-1">
                                                <p class="text-[#0d131b] dark:text-slate-300 text-base font-medium leading-normal pb-2">
                                                    <#if !realm.loginWithEmailAllowed>Usuario<#elseif !realm.registrationEmailAsUsername>Usuario o Correo<#else>Correo Electrónico</#if> *
                                                </p>
                                                <input required tabindex="1" id="username" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d131b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfd9e7] dark:border-slate-700 bg-background-light dark:bg-slate-800 focus:border-primary h-14 placeholder:text-[#4c6c9a] dark:placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal" name="username" value="${(login.username!'')}" type="text" autofocus autocomplete="off" placeholder="Ingresa tu usuario" />
                                            </label>

                                            <label class="flex flex-col min-w-40 flex-1">
                                                <div class="flex justify-between items-center pb-2">
                                                    <p class="text-[#0d131b] dark:text-slate-300 text-base font-medium leading-normal">Contraseña *</p>
                                                    <#if realm.resetPasswordAllowed>
                                                        <a class="text-sm font-medium text-primary hover:underline" href="${url.loginResetCredentialsUrl}">¿Olvidaste tu contraseña?</a>
                                                    </#if>
                                                </div>
                                                <div class="relative flex w-full flex-1 items-stretch">
                                                    <input required tabindex="2" id="password" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d131b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfd9e7] dark:border-slate-700 bg-background-light dark:bg-slate-800 focus:border-primary h-14 placeholder:text-[#4c6c9a] dark:placeholder:text-slate-500 p-[15px] pr-12 text-base font-normal leading-normal" name="password" type="password" autocomplete="off" placeholder="Ingresa tu contraseña" />
                                                    <button type="button" onclick="togglePassword('password', this)" class="absolute inset-y-0 right-0 flex items-center justify-center pr-4 text-[#4c6c9a] dark:text-slate-400">
                                                        <span class="material-symbols-outlined eye-open">visibility</span>
                                                        <span class="material-symbols-outlined eye-closed hidden">visibility_off</span>
                                                    </button>
                                                </div>
                                            </label>

                                            <#if realm.rememberMe && !usernameEditDisabled??>
                                                <div style="--checkbox-tick-svg: url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(255,255,255)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e');">
                                                    <label class="flex gap-x-3 items-center">
                                                        <input tabindex="3" id="rememberMe" name="rememberMe" class="h-5 w-5 rounded border-[#cfd9e7] dark:border-slate-600 border-2 bg-transparent text-primary checked:bg-primary checked:border-primary checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#cfd9e7] dark:focus:border-slate-500 focus:outline-none" type="checkbox" <#if login.rememberMe??>checked</#if> />
                                                        <p class="text-[#0d131b] dark:text-slate-200 text-base font-normal leading-normal">Recordarme</p>
                                                    </label>
                                                </div>
                                            </#if>

                                            <button tabindex="4" class="flex h-14 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" name="login" id="kc-login" type="submit">
                                                Iniciar Sesión
                                            </button>
                                        </div>
                                    </form>
                                </#if>

                                <!-- Google Sign In Button - Siempre visible -->
                                <div class="space-y-6">
                                    <div class="relative">
                                        <div class="absolute inset-0 flex items-center">
                                            <span class="w-full border-t border-[#cfd9e7] dark:border-slate-700"></span>
                                        </div>
                                        <div class="relative flex justify-center text-sm">
                                            <span class="bg-background-light dark:bg-background-dark px-2 text-[#4c6c9a] dark:text-slate-400">O iniciar sesión con</span>
                                        </div>
                                    </div>
                                    
                                    <#if social.providers??>
                                        <div class="grid grid-cols-1 gap-3">
                                            <#list social.providers as p>
                                                <a href="${p.loginUrl}" class="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-[#cfd9e7] dark:border-slate-700 bg-background-light dark:bg-slate-800 px-4 py-2 text-sm font-medium text-[#0d131b] dark:text-white shadow-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-700">
                                                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                                    </svg>
                                                    <span class="font-medium">${p.displayName!}</span>
                                                </a>
                                            </#list>
                                        </div>
                                    <#else>
                                        <button type="button" onclick="alert('Para habilitar Google Sign-In, configura el proveedor en Keycloak: Identity Providers → Add provider → Google')" class="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-[#cfd9e7] dark:border-slate-700 bg-background-light dark:bg-slate-800 px-4 py-2 text-sm font-medium text-[#0d131b] dark:text-white shadow-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-700">
                                            <svg class="w-5 h-5" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                            </svg>
                                            <span class="font-medium">Continuar con Google</span>
                                        </button>
                                    </#if>
                                </div>

                                <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
                                    <p class="text-center text-base text-[#4c6c9a] dark:text-slate-400">
                                        ¿No tienes una cuenta? <a class="font-semibold text-primary hover:underline" href="${url.registrationUrl}">Regístrate</a>
                                    </p>
                                </#if>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function togglePassword(inputId, button) {
            const input = document.getElementById(inputId);
            const eyeOpen = button.querySelector('.eye-open');
            const eyeClosed = button.querySelector('.eye-closed');
            
            if (input.type === 'password') {
                input.type = 'text';
                eyeOpen.classList.add('hidden');
                eyeClosed.classList.remove('hidden');
            } else {
                input.type = 'password';
                eyeOpen.classList.remove('hidden');
                eyeClosed.classList.add('hidden');
            }
        }
    </script>
    </#if>
</@layout.registrationLayout>