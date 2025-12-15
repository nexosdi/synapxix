<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=false; section>
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
                                <p class="text-3xl font-bold tracking-tight text-white">Nueva Contraseña</p>
                                <p class="mt-2 text-white/80">Elige una contraseña segura para proteger tu cuenta.</p>
                            </div>
                        </div>

                        <!-- Right Panel - Form -->
                        <div class="flex items-center justify-center p-6 sm:p-12 bg-background-light dark:bg-background-dark">
                            <div class="w-full max-w-md space-y-8">
                                <div class="flex min-w-72 flex-col gap-2 text-center lg:text-left">
                                    <p class="text-[#0d131b] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Actualizar Contraseña</p>
                                    <p class="text-[#4c6c9a] dark:text-slate-400 text-base font-normal leading-normal">Ingresa tu nueva contraseña.</p>
                                </div>

                                <#if message?has_content>
                                    <div class="p-4 rounded-lg ${(message.type == 'error')?then('bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800', 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800')}">
                                        ${message.summary?no_esc}
                                    </div>
                                </#if>

                                <form id="kc-passwd-update-form" action="${url.loginAction}" method="post">
                                    <input type="text" id="username" name="username" value="${username}" autocomplete="username" readonly="readonly" style="display:none;"/>
                                    <input type="password" id="password" name="password" autocomplete="current-password" style="display:none;"/>

                                    <div class="space-y-6">
                                        <label class="flex flex-col min-w-40 flex-1">
                                            <p class="text-[#0d131b] dark:text-slate-300 text-base font-medium leading-normal pb-2">Nueva Contraseña *</p>
                                            <div class="relative flex w-full flex-1 items-stretch">
                                                <input required autofocus type="password" id="password-new" name="password-new" autocomplete="new-password" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d131b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfd9e7] dark:border-slate-700 bg-background-light dark:bg-slate-800 focus:border-primary h-14 placeholder:text-[#4c6c9a] dark:placeholder:text-slate-500 p-[15px] pr-12 text-base font-normal leading-normal" placeholder="Ingresa tu nueva contraseña" aria-invalid="<#if messagesPerField.existsError('password','password-confirm')>true</#if>" />
                                                <button type="button" onclick="togglePassword('password-new', this)" class="absolute inset-y-0 right-0 flex items-center justify-center pr-4 text-[#4c6c9a] dark:text-slate-400">
                                                    <span class="material-symbols-outlined eye-open">visibility</span>
                                                    <span class="material-symbols-outlined eye-closed hidden">visibility_off</span>
                                                </button>
                                            </div>
                                            <#if messagesPerField.existsError('password')>
                                                <span class="text-sm text-red-600 dark:text-red-400 mt-1">${kcSanitize(messagesPerField.get('password'))?no_esc}</span>
                                            </#if>
                                        </label>

                                        <label class="flex flex-col min-w-40 flex-1">
                                            <p class="text-[#0d131b] dark:text-slate-300 text-base font-medium leading-normal pb-2">Confirmar Nueva Contraseña *</p>
                                            <div class="relative flex w-full flex-1 items-stretch">
                                                <input required type="password" id="password-confirm" name="password-confirm" autocomplete="new-password" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d131b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfd9e7] dark:border-slate-700 bg-background-light dark:bg-slate-800 focus:border-primary h-14 placeholder:text-[#4c6c9a] dark:placeholder:text-slate-500 p-[15px] pr-12 text-base font-normal leading-normal" placeholder="Confirma tu nueva contraseña" aria-invalid="<#if messagesPerField.existsError('password-confirm')>true</#if>" />
                                                <button type="button" onclick="togglePassword('password-confirm', this)" class="absolute inset-y-0 right-0 flex items-center justify-center pr-4 text-[#4c6c9a] dark:text-slate-400">
                                                    <span class="material-symbols-outlined eye-open">visibility</span>
                                                    <span class="material-symbols-outlined eye-closed hidden">visibility_off</span>
                                                </button>
                                            </div>
                                            <#if messagesPerField.existsError('password-confirm')>
                                                <span class="text-sm text-red-600 dark:text-red-400 mt-1">${kcSanitize(messagesPerField.get('password-confirm'))?no_esc}</span>
                                            </#if>
                                        </label>

                                        <div class="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                            <p class="text-xs text-blue-800 dark:text-blue-200">
                                                <strong>Tu contraseña debe tener:</strong><br/>
                                                • Al menos 8 caracteres<br/>
                                                • Una letra mayúscula y una minúscula<br/>
                                                • Al menos un número
                                            </p>
                                        </div>

                                        <button type="submit" class="flex h-14 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                                            Actualizar Contraseña
                                        </button>
                                    </div>
                                </form>

                                <#if isAppInitiatedAction??>
                                    <div class="flex items-center justify-center">
                                        <a class="text-base font-medium text-primary hover:underline" href="${url.loginUrl}">
                                            ← Cancelar
                                        </a>
                                    </div>
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
