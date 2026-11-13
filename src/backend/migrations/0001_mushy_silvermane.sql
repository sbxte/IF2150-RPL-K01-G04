PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_status_server` (
	`id_status` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`jenis` text NOT NULL,
	`status_uptime` integer NOT NULL,
	`waktu_cek` text NOT NULL,
	CONSTRAINT "status_jenis_check" CHECK("__new_status_server"."jenis" IN ('server', 'db')),
	CONSTRAINT "status_uptime_check" CHECK("__new_status_server"."status_uptime" IN (0, 1))
);
--> statement-breakpoint
DELETE FROM `status_server` WHERE "jenis" = 'website';--> statement-breakpoint
INSERT INTO `__new_status_server`("id_status", "jenis", "status_uptime", "waktu_cek") SELECT "id_status", "jenis", "status_uptime", "waktu_cek" FROM `status_server`;--> statement-breakpoint
DROP TABLE `status_server`;--> statement-breakpoint
ALTER TABLE `__new_status_server` RENAME TO `status_server`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_status_jenis_waktu` ON `status_server` (`jenis`,`waktu_cek`);