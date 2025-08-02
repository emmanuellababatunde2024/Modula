;; Soulbound eligibility token for public service access

(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-TOKEN-EXISTS u101)
(define-constant ERR-TOKEN-NOT-FOUND u102)
(define-constant ERR-ZERO-ADDRESS u103)
(define-constant ERR-PAUSED u104)

;; Token Metadata
(define-constant TOKEN-NAME "Modula Access Token")
(define-constant TOKEN-SYMBOL "MAT")

;; Admin and contract state
(define-data-var admin principal tx-sender)
(define-data-var paused bool false)

;; Token: token-id is uint, owned by a principal
(define-map token-owners uint principal)
(define-map token-metadata uint (string-ascii 256))

;; Next token ID
(define-data-var next-id uint u1)

;; Private helpers
(define-private (is-admin)
  (is-eq tx-sender (var-get admin))
)

(define-private (ensure-not-paused)
  (asserts! (not (var-get paused)) (err ERR-PAUSED))
)

;; Admin functions
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (asserts! (not (is-eq new-admin 'SP000000000000000000002Q6VF78)) (err ERR-ZERO-ADDRESS))
    (var-set admin new-admin)
    (ok true)
  )
)

(define-public (set-paused (pause bool))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (var-set paused pause)
    (ok pause)
  )
)

;; Issue a non-transferable access token to a recipient
(define-public (mint-access-token (recipient principal) (metadata string-ascii 256))
  (begin
    (ensure-not-paused)
    (asserts! (not (is-eq recipient 'SP000000000000000000002Q6VF78)) (err ERR-ZERO-ADDRESS))
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (let ((new-id (var-get next-id)))
      (map-set token-owners new-id recipient)
      (map-set token-metadata new-id metadata)
      (var-set next-id (+ new-id u1))
      (ok new-id)
    )
  )
)

;; Burn token (revoking access)
(define-public (burn-access-token (token-id uint))
  (begin
    (ensure-not-paused)
    (let ((owner (map-get? token-owners token-id)))
      (match owner
        owner-principal
          (begin
            (asserts! (or (is-eq tx-sender owner-principal) (is-admin)) (err ERR-NOT-AUTHORIZED))
            (map-delete token-owners token-id)
            (map-delete token-metadata token-id)
            (ok true)
          )
        (err ERR-TOKEN-NOT-FOUND)
      )
    )
  )
)

;; Read-only functions
(define-read-only (get-admin)
  (ok (var-get admin))
)

(define-read-only (is-paused)
  (ok (var-get paused))
)

(define-read-only (get-owner (token-id uint))
  (match (map-get? token-owners token-id)
    owner (ok owner)
    (err ERR-TOKEN-NOT-FOUND)
  )
)

(define-read-only (get-token-metadata (token-id uint))
  (match (map-get? token-metadata token-id)
    data (ok data)
    (err ERR-TOKEN-NOT-FOUND)
  )
)

(define-read-only (get-next-token-id)
  (ok (var-get next-id))
)

