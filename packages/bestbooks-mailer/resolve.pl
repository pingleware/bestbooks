use strict;
use warnings;
use Net::DNS;

# Get the hostname from the command-line arguments
my $hostname = shift @ARGV;

# Check if a hostname was provided
unless ($hostname) {
    die "Usage: perl script.pl <hostname>\n";
}

# Create a resolver object
my $resolver = Net::DNS::Resolver->new;

# Perform DNS lookup
my $query = $resolver->search($hostname);

# Check if the lookup was successful
if ($query) {
    foreach my $rr ($query->answer) {
        next unless $rr->type eq 'A'; # Filter out IPv4 records
        print $rr->address, ','; 
    }
} else {
    warn 'DNS lookup failed: ', $resolver->errorstring;
}
