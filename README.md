Bilder Funktion:

<!-- ✅ Bilder optional (Drag & Drop + Status) -->
                <div class="form-group">
                    <label for="bilder">Bilder (optional)</label>

                    <div class="upload-zone" id="upload-zone" tabindex="0" role="button"
                        aria-label="Bilder hier ablegen oder auswählen">

                        <!-- ✅ WICHTIG: name="bilder" (ohne Umlaut) -->
                        <input type="file" id="bilder" name="bilder" accept="image/jpeg,image/png,image/webp"
                            multiple />

                        <div class="upload-zone-inner">
                            <div class="upload-title">
                                <i class="fa-regular fa-image"></i>
                                <span><strong>Dateien hier ablegen</strong> oder klicken zum Auswählen</span>
                            </div>
                            <div class="upload-sub">
                                Erlaubt: JPG/PNG/WebP · max. 10 Bilder · max. 5120 KB
                            </div>

                            <!-- ✅ passend zu deinem KB/10-Bilder Script -->
                            <div class="upload-status" id="upload-status">0.0 KB · 0/10 Bilder</div>
                        </div>
                    </div>

                    <span class="error-message" id="error-bilder"></span>
                    <div class="image-preview" id="image-preview" aria-live="polite"></div>
                </div>
